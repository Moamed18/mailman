import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateEmailDto {
    @IsString()
    emailSubject: string;

    @IsString()
    email_body: string;

    @IsMongoId()
    @ApiProperty({
        type: [String],
        required: true,
    })
    list: string[];

    @IsOptional()
    scheduledAt?: Date;

    @IsOptional()
    @IsBoolean()
    sendNow: boolean

    @IsString()
    repeat_send: string;

    @IsOptional()
    @IsString()
    repeat_interval?: string;

    @IsBoolean()
    unsubscribe: boolean
}

export class UpdateEmailDto extends PartialType(CreateEmailDto) { }