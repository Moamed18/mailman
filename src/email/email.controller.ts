import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StaffAuthGuard } from 'src/staff/guards/staff-auth.guard';
import { CreateEmailDto, UpdateEmailDto } from './dto/email.dto';
import { EmailService } from './email.service';
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Get('')
    @UseGuards(StaffAuthGuard)
    async findAll() {
        return await this.emailService.findAll();
    }

    @Get('findDataCount')
    @UseGuards(StaffAuthGuard)
    async findDataCount(@Query('monthType') monthType: string) {

        return await this.emailService.findDataCount(monthType);
    }

    @Post('create')
    @UseGuards(StaffAuthGuard)
    async create(@Body() dto: CreateEmailDto) {
        return await this.emailService.create(dto);
    }

    // @Post('image')
    // @UseGuards(StaffAuthGuard)
    // @UseInterceptors(
    //     FileInterceptor('file', {
    //         storage: diskStorage({
    //             destination: './uploads',
    //             filename: (req, file, callback) => {
    //                 const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    //                 callback(null, uniqueName);
    //             },
    //         }),
    //         fileFilter: (req, file, callback) => {
    //             callback(null, true);
    //         },
    //     }),
    // )
    // @ApiConsumes('multipart/form-data')
    // @UseGuards(StaffAuthGuard)
    // async uploadImage(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Res() res: Response
    // ) {
    //     if (!file) {
    //         return new BadRequestException(HttpStatus.BAD_REQUEST)
    //     }

    //     const fileUrl = `https://togetherpro.xyz/uploads/${file.filename}`;

    //     return res.status(HttpStatus.OK).json({ "location": fileUrl });

    // }

    @Patch('update/:id')
    @UseGuards(StaffAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateEmailDto,
    ) {
        {
            return await this.emailService.update(id, dto);
        }
    }

    @Delete('delete/:id')
    @UseGuards(StaffAuthGuard)
    async remove(@Param('id') id: string,) {
        return await this.emailService.remove(id);
    }

}
