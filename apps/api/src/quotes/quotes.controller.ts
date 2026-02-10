import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteStatusDto } from '@tesland/dto';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('quotes')
export class QuotesController {
    constructor(private readonly quotesService: QuotesService) { }

    @Post()
    create(@Body() createQuoteDto: CreateQuoteDto) {
        return this.quotesService.create(createQuoteDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SERVICE_MANAGER')
    findAll() {
        return this.quotesService.findAll();
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SERVICE_MANAGER')
    updateStatus(@Param('id') id: string, @Body() updateQuoteStatusDto: UpdateQuoteStatusDto) {
        return this.quotesService.updateStatus(id, updateQuoteStatusDto);
    }
}
