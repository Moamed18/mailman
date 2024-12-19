import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { StaffAuthGuard } from 'src/staff/guards/staff-auth.guard';
import { ListService } from './list.service';
@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService) { }

    @Get('/:id')
    @UseGuards(StaffAuthGuard)
    async findOne(@Param('id') id: string) {
        return this.listService.findOne(id);
    }

    @Get('')
    @UseGuards(StaffAuthGuard)
    findAll(
    ) {
        return this.listService.findAll();
    }



    @Get('download-unsubscribed-clients')
    @UseGuards(StaffAuthGuard)
    async downloadUnsubscribedClients(@Res() res: Response) {
        try {
            await this.listService.downloadUnsubscribedClients(res);
        } catch (error) {
            console.error('Error occurred while downloading unsubscribed clients:', error);
            throw new NotFoundException(error.message);
        }
    }

    @Post('add-email/:listId')
    @UseGuards(StaffAuthGuard)
    async addEmail(
        @Param('listId') listId: string,
        @Body('email') email: string
    ) {
        return await this.listService.addEmail(listId, email);
    }


    @Post('unsubscribe/:id')
    async unsubscribe(
        @Param('id') id: string,
        @Body() { email, unsubscribe }: { email: string, unsubscribe: boolean }
    ) {
        return await this.listService.unsubscreption(id, email, unsubscribe);
    }

    @Patch('update-list/:id')
    @UseGuards(StaffAuthGuard)
    async update(
        @Body('name') name: string,
        @Param('id') id: string
    ) {
        {
            return await this.listService.update(id, name);
        }
    }



    @Post('import')
    @UseGuards(StaffAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async importList(
        @UploadedFile() file: Express.Multer.File,
        @Query('listName') listName: string,
    ) {
        console.log(listName);
        return await this.listService.importList(file, listName);
    }

    @Patch('update-email/:listId')
    @UseGuards(StaffAuthGuard)
    async updateEmail(
        @Param('listId') listId: string,
        @Body('oldEmail') oldEmail: string,
        @Body('newEmail') newEmail: string
    ) {
        if (!oldEmail || !newEmail) {
            throw new BadRequestException('Both oldEmail and newEmail are required');
        }
        return this.listService.updateEmail(listId, oldEmail, newEmail);
    }

    @Delete('email/:listId')
    async deleteEmail(
        @Param('listId') listId: string,
        @Body('email') email: string
    ) {
        if (!email) {
            throw new BadRequestException('Email is required');
        }

        return this.listService.deleteEmail(listId, email);
    }

    @Delete('delete/:id')
    @UseGuards(StaffAuthGuard)
    async remove(@Param('id') id: string,) {
        return await this.listService.remove(id);
    }

}
