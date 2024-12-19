import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CampaignStatus } from 'src/constants/enum.constants';
import { ListService } from 'src/list/list.service';
import { CreateEmailDto, UpdateEmailDto } from './dto/email.dto';
import { EmailConfig, EmailConfigDocument } from './entity/email.entity';
@Injectable()
export class EmailService {
    constructor(
        @InjectModel(EmailConfig.name) public emailModel: Model<EmailConfigDocument>,
        @Inject(forwardRef(() => ListService)) private listService: ListService,
    ) {
    }

    async create(dto: CreateEmailDto) {
        await this.emailModel.create({ ...dto, status: CampaignStatus.archived });
        return {
            message: 'Email created successfully',
        };
    }


    public createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
            fileFilter: (req, file, callback) => {
                callback(null, true);
            },
        };
    }

    async findAll() {
        return await this.emailModel.find({ removed: false })
    }

    async update(id: string, dto: UpdateEmailDto) {
        const existing = await this.emailModel.findOne({
            _id: id,
            removed: false,
        });

        if (!existing) {
            throw new BadRequestException('Email not exists');
        }

        await this.emailModel.findByIdAndUpdate(id, {
            ...dto,
            removed: false
        });

        return {
            message: 'Email updated successfully',
        };
    }

    async remove(id: string,) {

        const existing = await this.emailModel.findOne({
            _id: id,
            removed: false,
        }).populate('list');

        if (!existing) {
            throw new BadRequestException('Email not exists');
        }

        await this.emailModel.findByIdAndUpdate(id, {
            $set: { list: [], removed: true },
        });
        return {
            message: 'Email deleted successfully',
        };
    }

    async findDataCount(monthType?: string) {
        const now = new Date();

        let startDate, endDate;

        if (monthType === 'thisMonth') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        } else if (monthType === 'lastMonth') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const dateFilter = monthType ? { createdAt: { $gte: startDate, $lt: endDate } } : {};

        const emailTemplate = await this.emailModel.countDocuments({
            removed: false,
            ...dateFilter
        });

        const listCount = await this.listService.listModel.countDocuments({
            removed: false,
            ...dateFilter
        });

        let CustomersEmails = 0;
        const lists = await this.listService.listModel.find({
            removed: false,
            ...dateFilter
        });

        lists.forEach((l) => {
            CustomersEmails += l.consumerEmails.length;
        });

        let BulkEmails = 0;
        const emails = await this.emailModel.find({
            removed: false,
            ...dateFilter
        }).exec();

        // Sum up BulkEmails
        emails.forEach((e) => {
            BulkEmails += e.successfullySentEmails.length;
        });

        return {
            emailTemplate,
            listCount,
            CustomersEmails,
            BulkEmails
        };
    }

    findOneByQuery(query: any) {
        return this.emailModel.findOne({
            removed: false,
            ...query,
        });
    }

}
