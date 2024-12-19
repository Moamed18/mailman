import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './cron/cron.module';
import { EmailSettingModule } from './email-setting/emailSetting.module';
import { EmailModule } from './email/email.module';
import { ListModule } from './list/list.module';
import { StaffModule } from './staff/staff.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL), ListModule,
    EmailModule,
    EmailSettingModule,
    CronModule,
    StaffModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
