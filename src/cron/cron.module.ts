import { Module } from '@nestjs/common';

// import { MessageRecordModule } from 'src/MessageRecord/messageRecord.module';
import { EmailModule } from 'src/email/email.module';
import { CronService } from './cron.service';
import { EmailSettingModule } from 'src/email-setting/emailSetting.module';

@Module({
    imports: [
        // NotificationModule,
        // CategoryModule,
        // UserModule, CompanyActivationModule,
        // CountryModule,
        // SettingModule, SmsGetWayModule, ConsumerModule,
        // JwtModule.register({
        //     secret: process.env.JWT_SECRET,
        // }),
        EmailModule,
        EmailSettingModule
    ],
    controllers: [],
    providers: [CronService],

})
export class CronModule { }
