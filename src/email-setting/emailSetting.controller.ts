import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmailSettingDto } from './dto/emailSetting.dto';
import { EmailSettingService } from './emailSetting.service';
import { StaffAuthGuard } from 'src/staff/guards/staff-auth.guard';

@Controller('email-setting')
export class EmailSettingController {
    constructor(private readonly emailSettingService: EmailSettingService) { }


    @Get('')
    @UseGuards(StaffAuthGuard)
    async findAll() {
        return await this.emailSettingService.findAll();
    }


    @Post('create')
    @UseGuards(StaffAuthGuard)
    async create(@Body() dto: EmailSettingDto) {
        return await this.emailSettingService.create(dto);
    }

}
