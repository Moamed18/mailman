import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type EmailSettingDocument = EmailSetting & Document;
@Schema({ timestamps: true, autoIndex: true })

export class EmailSetting {

    // @Prop({
    //     type: String,
    //     trim: true,
    // })
    // host: string;

    @Prop({
        type: String,
        trim: true,
    })
    email: string;

    @Prop({
        type: String,
        trim: true,
    })
    senderName: string;

    @Prop({
        type: String,
        trim: true,
    })
    password: string;

    @Prop({
        type: Number,
        trim: true,
        min: 0
    })
    emailsPerHour: number;

}

export const EmailSettingSchema = SchemaFactory.createForClass(EmailSetting); 