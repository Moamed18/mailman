import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'src/utils/validator';


export class CreateStaffDto {

    @IsString()
    firstName: string;

    @IsString()
    lasName: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty({
        type: String,
        required: true,
        minimum: 8
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty({
        type: String,
        required: true,
        minimum: 8
    })
    confirmPassword: string;

}

export class UpdateStaffDto extends PartialType(
    OmitType(CreateStaffDto, ['password'] as const),
) { }
export class LogInDto {
    @IsString()
    @ApiProperty({ type: String, required: true })
    email: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ type: String, required: true })
    password: string;
}

export class otpLogInDto {
    @IsOptional()
    @ApiProperty({ type: String, required: false })
    email: string;

    @IsOptional()
    @ApiProperty({ type: String, required: false })
    phoneNumber: string;
}

export class SecretQuestionDto {
    @IsString()
    @ApiProperty({ type: String, required: true })
    secretQuestion1: string;

    @IsString()
    @ApiProperty({ type: String, required: true })
    answer1: string;

    @IsString()
    @ApiProperty({ type: String, required: true })
    secretQuestion2: string;

    @IsString()
    @ApiProperty({ type: String, required: true })
    answer2: string;
}

// export class LogInDto {
//     @IsString()
//     @ApiProperty({ type: String, required: true })
//     emailOrPhoneNumber: string;

//     @IsString()
//     @MinLength(8)
//     @ApiProperty({ type: String, required: true })
//     password: string;

//     @IsString()
//     @ApiProperty({ type: String, required: true })
//     answer1: string;

//     @IsString()
//     @ApiProperty({ type: String, required: true })
//     answer2: string;

// }

export class ChangePhoneNumberDto {

    @IsString()
    @ApiProperty({ type: String, required: true })
    oldPhoneNumber: string;

    @IsString()
    @ApiProperty({ type: String, required: true })
    newPhoneNumber: string;
}

export class ResetPasswordDto {

    @IsString()
    @MinLength(8)
    @ApiProperty({ type: String, required: true, minimum: 8 })
    password: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ type: String, required: true, minimum: 8 })
    confirmPassword: string
}
