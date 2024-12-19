import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { List, ListSchema } from './entity/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [
    forwardRef(() => EmailModule),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],

})
export class ListModule { }
