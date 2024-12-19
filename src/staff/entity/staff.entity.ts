import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
// import { SecretQuestion } from 'src/constants/enum.constants';
import * as bcrypt from 'bcryptjs';

export type StaffDocument = Staff & Document;


@Schema({ timestamps: true, autoIndex: true })
export class Staff {
    @Transform((value) => {
        if (value.obj) return value.obj._id.toString();
    })
    @Expose()
    _id: string;

    @Prop({ type: String })
    firstName: string

    @Prop({ type: String })
    lastName: string

    @ApiProperty({
        type: String,
        required: true,
        example: 'example@zedtalents.com',
        description: 'Account Email',
    })
    @Prop({ type: String })
    email: string;

    @Exclude()
    @Prop({ type: String })
    password: string;

    @Prop({ type: Boolean, default: false, index: true })
    removed: boolean;

    passwordCheck: (password: string) => Promise<boolean>;

}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

StaffSchema.methods.passwordCheck = async function (password: string) {
    const isPassword = await bcrypt.compare(password, this.password);
    return isPassword;
};


StaffSchema.pre('findOneAndUpdate', async function (next: any) {
    let password = this.getUpdate()['$set'].password;
    if (!password) {
        password = this.getUpdate()['password'];
        if (!password) return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.getUpdate()['$set'].password = await bcrypt.hash(password, salt);
    delete this.getUpdate()['password'];
    next();
});














