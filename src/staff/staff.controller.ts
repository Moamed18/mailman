import { Body, Post } from '@nestjs/common';

import { BearerAuthPackDecorator } from 'src/utils/nestMethods.utils';
import { CreateStaffDto, LogInDto } from './dto/staff.dto';
import { StaffService } from './staff.service';


@BearerAuthPackDecorator('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }


    @Post('signup')
    async signUp(@Body() dto: CreateStaffDto) {
        return await this.staffService.signUp(dto);
    }

    @Post('/login')
    async login(@Body() loginDto: LogInDto) {
        return this.staffService.login(loginDto);
    }


}
