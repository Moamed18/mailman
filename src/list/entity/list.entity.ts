import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

@Schema({ _id: false })
class ConsumerList {

    @Prop({
        type: String,
        trim: true,
    })
    email: string;

    @Prop({ type: Boolean, default: false, })
    unsubscribe: boolean

}
const ConsumerListSchema = SchemaFactory.createForClass(ConsumerList);

export type ListDocument = List & Document;
@Schema({ timestamps: true, autoIndex: true })
export class List {
    @Transform((value) => {
        if (value.obj) return value.obj._id.toString();
    })
    @Expose()
    _id: string;

    @Prop({
        type: String,
        trim: true,
    })
    name: string;

    @Prop({ type: [ConsumerListSchema] })
    consumerEmails: ConsumerList[];

    @Prop({ type: Boolean, default: false, index: true })
    removed: boolean;
}

export const ListSchema = SchemaFactory.createForClass(List); 