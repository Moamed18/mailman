import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import * as xlsx from 'xlsx';
import { List, ListDocument } from './entity/list.entity';

@Injectable()
export class ListService {
    constructor(
        @InjectModel(List.name) public listModel: Model<ListDocument>,
        @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    ) {
    }
    async importList(file: Express.Multer.File, listName: string) {

        if (!file) {
            throw new BadRequestException('Please import a file');
        }

        const listGroup = await this.listModel.findOne({
            name: listName.toLowerCase(),
            removed: false
        })

        if (listGroup) {
            throw new BadRequestException("List name already exist")
        }

        // Determine the file extension
        const originalname = file.originalname;
        const lastIndex = originalname.lastIndexOf('.');
        const fileExtension = lastIndex !== -1 ? originalname.slice(lastIndex).toLowerCase() : '';

        if (fileExtension !== '.xlsx' && fileExtension !== '.txt') {
            throw new BadRequestException('Unsupported file type. Please upload an Excel sheet (.xlsx) or a text file (.txt).');
        }

        let validEmails: any;

        if (fileExtension === '.xlsx') {
            const response = await this.validateExcelSheet(file);
            if (Array.isArray(response)) {
                validEmails = response;
            }

        } else if (fileExtension === '.txt') {
            const response = await this.validateTextFile(file);
            if (Array.isArray(response)) {
                validEmails = response;
            }
        }

        await this.listModel.create(
            {
                name: listName.toLowerCase(),
                consumerEmails: validEmails.map(email => ({
                    email: email.toLowerCase(),
                    unsubscribe: false,
                })),
                removed: false
            });
        return { message: "List created successfully" }

    }

    async validateExcelSheet(file: Express.Multer.File) {
        const uniqueEmails = [];
        const errors = [];

        let contactReadFile = xlsx.read(file.buffer, { cellDates: true });
        const sheetName = contactReadFile.SheetNames[0];

        if (!sheetName) {
            throw new BadRequestException('No sheet found in the Excel file');
        }

        // Convert the sheet data to JSON format
        const sheetData = xlsx.utils.sheet_to_json(contactReadFile.Sheets[sheetName]);

        // Iterate through each row in the sheet
        sheetData.forEach((rowData, index) => {
            const email = Object.values(rowData)[0]; // Assuming email is in the first column

            if (typeof email === 'string') {
                const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!validEmailPattern.test(email)) {
                    errors.push({ email: email, row: index + 2 });
                } else {
                    // Check for uniqueness and add to the uniqueEmails array
                    if (!uniqueEmails.some(contact => contact.email === email)) {
                        uniqueEmails.push({ email: email, row: index + 2 });
                    }
                }
            } else {
                // If email is not a string, add to errors
                errors.push({ email: email, row: index + 2 });
            }
        });

        if (errors.length > 0) {
            return errors;
        } else {
            return uniqueEmails;
        }
    }
    async validateTextFile(file: Express.Multer.File) {
        const errors = [];
        const textContent = file.buffer.toString();
        const lines = textContent.split('\n');

        const validEmails = [];

        for (const line of lines) {
            const cleanedLine = line.replace(/\r/g, '').trim();
            const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (cleanedLine !== '') {
                if (!validEmailPattern.test(cleanedLine)) {
                    errors.push(cleanedLine);
                } else {
                    if (!validEmails.includes(cleanedLine)) {
                        validEmails.push(cleanedLine);
                    }
                }
            }
        }
        if (errors.length > 0) {
            return errors;
        } else {
            return validEmails;
        }
    }

    async unsubscreption(id: string, email: string, unsubscribe: boolean) {

        const existingEmailList = await this.listModel.findOne({
            _id: id,
            removed: false,
        });

        if (!existingEmailList) {
            throw new BadRequestException('List does not exist');
        }

        const normalizedEmail = email.toLowerCase();

        if (unsubscribe === true) {

            await this.listModel.findByIdAndUpdate(id, {
                $set: { 'consumerEmails.$[elem].unsubscribe': true },
            }, {
                arrayFilters: [{ 'elem.email': normalizedEmail }],
            });

            return {
                message: 'Email unsubscribed successfully',
            };
        } else if (unsubscribe === false) {

            await this.listModel.findByIdAndUpdate(id, {
                $set: { 'consumerEmails.$[elem].unsubscribe': false },
            }, {
                arrayFilters: [{ 'elem.email': normalizedEmail }],
            });
            return {
                message: 'Email resubscribed successfully',
            };
        }
    }


    async downloadUnsubscribedClients(res: Response) {
        try {
            // Retrieve unsubscribed clients
            const unsubscribedClients = await this.listModel.aggregate([
                {
                    $unwind: "$unsubscribedEmails"
                },
                {
                    $project: {
                        _id: 0,
                        email: "$unsubscribedEmails"
                    }
                }
            ]).exec();

            if (unsubscribedClients.length === 0) {
                throw new NotFoundException('No unsubscribed clients found');
            }

            // Generate the file content dynamically
            const fileContent = unsubscribedClients
                .map(client => client.email)
                .join('\n');

            // Set response headers
            res.setHeader('Content-Disposition', 'attachment; filename="unsubscribed_clients.txt"');
            res.setHeader('Content-Type', 'text/plain');

            res.send(fileContent);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
    async findAll() {
        const lists = await this.listModel.find({ removed: false })
        return ({ lists, total: lists.length })
    }
    async update(id: string, ListName: string) {

        const existing = await this.listModel.findOne({
            _id: id,
            removed: false,
        });

        if (!existing) {
            throw new BadRequestException('List not exists');
        }

        await this.listModel.findByIdAndUpdate(id, {
            name: ListName,
            removed: false
        });

        return {
            message: 'List updated successfully',
        };
    }
    async remove(id: string,) {

        const existing = await this.listModel.findOne({
            _id: id,
            removed: false,
        });

        if (!existing) {
            throw new BadRequestException('List not exists');
        }

        await this.listModel.findByIdAndUpdate(id, {
            removed: true,

        });

        return {
            message: 'List deleted successfully',
        };
    }

    async findOne(listId: string) {
        return await this.listModel.findOne({ removed: false, _id: listId })
    }

    async addEmail(listId: string, email: string) {
        const list = await this.listModel.findOne({ _id: listId, removed: false })
        if (!list) {
            throw new BadRequestException('List not found!')
        }

        const emailExists = list.consumerEmails.some((c) => c.email.toLowerCase() === email.toLowerCase());

        if (emailExists) {
            throw new BadRequestException('Email already exists in the list');
        }

        list.consumerEmails.push({
            email: email.toLowerCase(),
            unsubscribe: false,
        });

        await list.save();
        return { message: 'Email added successfully' };
    }

    async updateEmail(listId: string, oldEmail: string, newEmail: string) {
        const existing = await this.listModel.findOne({
            _id: listId,
            removed: false,
        });

        if (!existing) {
            throw new BadRequestException('List not exists');
        }

        const updateResult = await this.listModel.findOneAndUpdate(
            {
                _id: listId,
                'consumerEmails.email': oldEmail.toLowerCase(),
                removed: false,
            },
            {
                $set: {
                    'consumerEmails.$.email': newEmail.toLowerCase(),
                },
            },
            { new: true }
        );

        if (!updateResult) {
            throw new BadRequestException('Email not found');
        }

        return {
            message: 'Email updated successfully',
        };
    }

    async deleteEmail(listId: string, email: string) {
        const normalizedEmail = email.toLowerCase();

        await this.listModel.findOneAndUpdate(
            {
                _id: listId,
                removed: false,
                'consumerEmails.email': normalizedEmail,
            },
            {
                $pull: {
                    consumerEmails: { email: normalizedEmail },
                },
            },
            { new: true }
        );

        return { message: 'Email deleted successfully' };
    }

}
