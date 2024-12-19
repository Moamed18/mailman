import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { EmailSettingService } from 'src/email-setting/emailSetting.service';
import { EmailService } from 'src/email/email.service';
import { List } from 'src/list/entity/list.entity';
const fs = require('fs');
const path = require('path');
@Injectable()
export class CronService {
    constructor(
        private emailService: EmailService,
        private emailSettingService: EmailSettingService,
    ) { }
    @Cron(CronExpression.EVERY_MINUTE)
    async sendEmail() {
        const now = new Date();
        const cairoTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        const campaignScheduled = await this.emailService.emailModel.find({
            $or: [
                { status: "archived", sending: false, scheduledAt: { $lte: cairoTime } },
                { status: "repeated", sending: false, repeat_send: "yes", scheduledAt: { $lte: cairoTime } },
                { sendNow: true, sending: false }
            ],
            removed: false,
        }).populate('list');

        if (campaignScheduled.length !== 0) {
            for (const campaign of campaignScheduled) {
                const allEmails = campaign.list
                    .map((listItem: List) => listItem.consumerEmails
                        .filter((c) => !c.unsubscribe)
                        .map((c) => ({
                            _id: listItem._id,
                            email: c.email,
                            unsubscribe: c.unsubscribe
                        }))
                    )
                    .flat();

                const uniqueEmails = Array.from(new Set(allEmails.map(item => item.email)))
                    .map(email => allEmails.find(item => item.email === email));

                const emailSetting = await this.emailSettingService.emailModel.findOne();
                const emailsPerHour = emailSetting.emailsPerHour;
                const emailsPerMinute = Math.ceil(emailsPerHour / 60);

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com', // Update to your SMTP server
                    port: 465,
                    secure: true,
                    auth: {
                        user: emailSetting.email,
                        pass: emailSetting.password,
                    },
                });
                // testnode1232@gmail.com
                // grnpmcotnwswqynz
                const sentEmails: string[] = [];
                let index = 0;
                const sendEmailBatch = async () => {
                    const batch = uniqueEmails.slice(index, index + emailsPerMinute);
                    for (const email of batch) {
                        let emailBody = campaign.email_body;

                        const base64ImageRegex = /<img src="(data:image\/[^;]+;base64,[^"]+)"/g;
                        let match;
                        while ((match = base64ImageRegex.exec(emailBody)) !== null) {
                            const base64Image = match[1];
                            const imageName = `email_image_${Date.now()}`;
                            const imageUrl = await this.saveImage(base64Image, imageName);
                            emailBody = emailBody.replace(base64Image, imageUrl);
                        }
                        const mailOptions = {
                            from: `${emailSetting.senderName} <${emailSetting.email}>`,
                            bcc: email.email,
                            subject: campaign.emailSubject,
                            html: emailBody,
                        };

                        try {
                            await transporter.sendMail(mailOptions);
                            sentEmails.push(email.email);
                            await this.emailService.emailModel.findByIdAndUpdate(
                                campaign._id,
                                {
                                    $set: { sending: true },
                                    $push: { successfullySentEmails: email.email }
                                },
                                { new: true }
                            );
                        } catch (error) {
                            console.log(error)
                            throw new BadRequestException(`Failed to send email to ${email.email}`, error);
                        }
                    }
                    index += emailsPerMinute;

                    if (index < uniqueEmails.length) {
                        setTimeout(sendEmailBatch, 60 * 1000);
                    } else {

                        let finishedCampaign;
                        if (campaign.repeat_send === "yes") {
                            finishedCampaign = await this.emailService.emailModel.findByIdAndUpdate(
                                campaign._id,
                                {
                                    $set: { status: 'repeated', sendNow: false, sending: false },

                                },
                                { new: true }
                            );
                        } else {
                            finishedCampaign = await this.emailService.emailModel.findByIdAndUpdate(
                                campaign._id,
                                {
                                    $set: { status: 'finished', sendNow: false, sending: false },

                                },
                                { new: true }
                            );
                        }

                        // Handle repeating campaigns scheduling
                        if (finishedCampaign.repeat_send === "yes" && finishedCampaign.status === 'repeated') {
                            let scheduledDate = campaign.scheduledAt ? new Date(campaign.scheduledAt) : cairoTime;
                            if (finishedCampaign.repeat_interval === "day") {
                                scheduledDate.setDate(scheduledDate.getDate() + 1);
                            } else if (finishedCampaign.repeat_interval === "week") {
                                scheduledDate.setDate(scheduledDate.getDate() + 7);
                            } else if (finishedCampaign.repeat_interval === "half-month") {
                                scheduledDate.setDate(scheduledDate.getDate() + 15);
                            } else if (finishedCampaign.repeat_interval === "month") {
                                scheduledDate.setMonth(scheduledDate.getMonth() + 1);
                            }

                            await this.emailService.emailModel.findOneAndUpdate(
                                { _id: campaign._id },
                                { $set: { scheduledAt: scheduledDate } }
                            );
                        }
                    }
                };

                // Start sending the first batch of emails
                sendEmailBatch();
            }
        }
    }


    async saveImage(base64Image: any, imageName: any) {
        // Decode base64 image
        const matches = base64Image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        const fileType = matches[1];
        const imageBuffer = Buffer.from(matches[2], 'base64');

        const imagePath = path.join('uploads/', `${imageName}.${fileType}`);

        fs.writeFileSync(imagePath, imageBuffer);

        return `${process.env.IMAGE_URL}/uploads/${imageName}.${fileType}`;
    }

}
