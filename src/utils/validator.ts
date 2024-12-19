import {
    ValidationArguments,
    ValidationOptions,
    isBoolean,
    isMongoId,
    isNotEmpty,
    isNumber,
    isString,
    isURL,
    registerDecorator
} from 'class-validator';
import { LanguageService } from 'src/language/lang.service';

export function IsString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isString',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    return isString(value) && typeof value === 'string';
                    // if (typeof value !== 'string') {
                    //     return false;
                    // }

                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `يجب أن يكون نصًا ${args.property}`;
                    }
                    return `${args.property} should be a string.`;
                },
            },
        });
    };
}

export function IsUrl(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUrl',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isURL(value);
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `يجب أن يكون رابطًا صحيحًا ${args.property}`;
                    }

                    return `${args.property} should be a valid URL.`;
                },
            },
        });
    };
}

export function IsNotEmpty(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNotEmpty',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isNotEmpty(value) && typeof value === 'string';
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `يجب أن يكون نصًا غير فارغًا ${args.property} `;
                    }

                    return `${args.property} should be a non-empty string.`;
                },
            },
        });
    };
}

export function IsNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                validate(value: any, args: ValidationArguments) {

                    return isNumber(value) && typeof value === 'number';
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `يجب أن يكون رقما ${args.property} `;
                    }

                    return `${args.property} should be a number`;
                },
            },
        });
    };
}

export function IsMongoId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMongoId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isMongoId(value) && typeof value === 'string';
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `مُعرّف MongoId يجب أن يكون ${args.property}`;
                    }

                    return `${args.property} should be a mongoId`;
                },
            },
        });
    };
}

export function IsBoolean(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isBoolean',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isBoolean(value) && typeof value === 'boolean';
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `(true/false) يجب أن يكون ${args.property}`;
                    }

                    return `${args.property} should be a boolean (true/false)`;
                },
            },
        });
    };
}

export function MinLength(minLength: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMinLength',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: false,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'string' && value.length >= minLength;
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `يجب أن يحتوي على ${minLength} حرفًا على الأقل ${args.property} `;
                    }

                    return `${args.property} should have a minimum length of ${minLength} characters.`;
                },
            },
        });
    };
}

export function IsDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) {
                        return false; // If the value is empty, it's not a valid date
                    }

                    const date = new Date(value);
                    return !isNaN(date.getTime()); // Check if the date is valid
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return `يجب أن يكون تاريخ صالح لـ ${args.property} `;
                    }

                    return `${args.property} should be a valid date.`;
                },
            },
        });
    };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function IsEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEmail',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'string') {
                        return false; // If the value is not a string, it's not a valid email
                    }

                    return emailRegex.test(value); // Check if the value matches the email pattern
                },
                defaultMessage(args: ValidationArguments) {
                    const lang = LanguageService.getLang();

                    if (lang === 'ar') {
                        return ` يجب أن يكون عنوان بريد الالكترونى صالحا ${args.property}`;
                    }

                    return `${args.property} should be a valid email address.`;
                },
            },
        });
    };
}