import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSettingController } from './emailSetting.controller';
import { EmailSettingService } from './emailSetting.service';
import { EmailSetting, EmailSettingSchema } from './entity/emailSetting.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forFeature([
            { name: EmailSetting.name, schema: EmailSettingSchema },
        ]),


    ],
    controllers: [EmailSettingController],
    providers: [EmailSettingService],
    exports: [EmailSettingService],
})
export class EmailSettingModule { }
