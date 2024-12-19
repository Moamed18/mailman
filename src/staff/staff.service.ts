import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CompleteAccountDto } from './dto/account.dto';
import { CreateStaffDto, LogInDto } from './dto/staff.dto';
import { Staff, StaffDocument } from './entity/staff.entity';
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    ) { }

    async signUp(dto: CreateStaffDto) {
        const existingEmailAccount = await this.staffModel.findOne({
            removed: false,
            email: dto.email,
        });

        if (existingEmailAccount) {
            throw new BadRequestException("Email already exist");
        }

        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException("Not same password");
        }

        const newAccount = await this.staffModel.create({ ...dto });

        const token = jwt.sign({
            _id: newAccount._id,
            email: newAccount.email,
        }, process.env.JWT_SECRET);

        return {
            message: "Sign up success",
            token,
        };
    }

    async login(loginDto: LogInDto) {

        let staffAccount = await this.staffModel.findOne({ email: loginDto.email.toLowerCase(), removed: false })

        if (!staffAccount) {
            throw new BadRequestException("Email not found");
        }

        if (!(await staffAccount.passwordCheck(loginDto.password))) {
            throw new BadRequestException("InValid Password");
        }

        const token = jwt.sign({ _id: staffAccount._id, email: staffAccount.email }, process.env.JWT_SECRET,)

        return {
            message: "Login success",
            firstName: staffAccount.firstName,
            lastName: staffAccount.lastName,
            email: staffAccount.email,
            token,
        }
    }

    findOneByQuery(query: any) {
        return this.staffModel.findOne({
            removed: false,
            ...query,
        });
    }

}