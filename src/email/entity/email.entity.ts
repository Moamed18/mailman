import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CampaignStatus } from 'src/constants/enum.constants';

export type EmailConfigDocument = EmailConfig & Document;
@Schema({ timestamps: true, autoIndex: true })

export class EmailConfig {

    @Prop({
        type: String,
        trim: true,
    })
    emailSubject: string;

    @Prop({ type: String })
    email_body: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }], index: true })
    list: object[];

    @Prop({ type: Date, required: false })
    scheduledAt?: Date

    @Prop({ type: String })
    repeat_send: string;

    @Prop({ type: String })
    repeat_interval?: string;

    @Prop({
        type: String,
        trim: true,
        enum: CampaignStatus,
    })
    status: CampaignStatus;

    @Prop({ type: [String], default: [] })
    successfullySentEmails: string[];

    @Prop({ type: Boolean, default: false })
    removed: boolean;

    @Prop({ type: Boolean, default: false })
    sending: boolean;

    @Prop({ type: Boolean, default: false })
    sendNow: boolean;

    @Prop({ type: Boolean, default: false, })
    unsubscribe: boolean
}

export const EmailConfigSchema = SchemaFactory.createForClass(EmailConfig); 