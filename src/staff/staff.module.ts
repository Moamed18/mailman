import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from "./entity/staff.entity";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";
import { JwtStaffStrategy } from "./strategies/jwt-staff.strategy";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forFeature([
            { name: Staff.name, schema: StaffSchema },
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    controllers: [StaffController],
    providers: [StaffService, JwtStaffStrategy],

    exports: [StaffService],
})

export class StaffModule { }