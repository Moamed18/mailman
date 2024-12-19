import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailSettingDto } from './dto/emailSetting.dto';
import { EmailSetting, EmailSettingDocument } from './entity/emailSetting.entity';

@Injectable()
export class EmailSettingService {
    constructor(
        @InjectModel(EmailSetting.name) public emailModel: Model<EmailSettingDocument>,
    ) {
    }

    async create(dto: EmailSettingDto) {
        const existingEmailSetting = await this.emailModel.findOne();

        if (existingEmailSetting) {
            await this.emailModel.findByIdAndUpdate(existingEmailSetting._id, dto, { new: true });
            return {
                message: 'Email settings updated successfully',
            };
        } else {
            await this.emailModel.create(dto);
            return {
                message: 'Email settings created successfully',
            };
        }
    }
    async findAll() {
        return await this.emailModel.findOne()
    }



}
