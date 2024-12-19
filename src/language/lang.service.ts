import { Injectable } from "@nestjs/common";

// language.service.ts
@Injectable()
export class LanguageService {
    private static currentLang: string = 'en';

    static getLang(): string {
        return this.currentLang;
    }

    static setLang(lang: string): void {
        this.currentLang = lang;
    }
}
