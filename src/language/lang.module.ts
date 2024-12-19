// language.module.ts
import { Module } from '@nestjs/common';
import { LanguageService } from './lang.service';


@Module({
    providers: [LanguageService],
    exports: [LanguageService],
})
export class LanguageModule { }
