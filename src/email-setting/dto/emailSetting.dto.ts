import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class EmailSettingDto {

    // @IsString()
    // host: string;

    @IsString()
    email: string;

    @IsString()
    senderName: string;

    @IsString()
    password: string;

    @IsNumber()
    @Min(0)
    emailsPerHour: number;

}

export class UpdateEmailSettingDto extends PartialType(EmailSettingDto) { }