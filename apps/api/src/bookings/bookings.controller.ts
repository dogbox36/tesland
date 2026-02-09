import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '@tesland/dto';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user.userId, createBookingDto);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    findMyBookings(@Request() req) {
        return this.bookingsService.findMyBookings(req.user.userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SERVICE_MANAGER')
    findAll() {
        return this.bookingsService.findAll();
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SERVICE_MANAGER')
    updateStatus(@Param('id') id: string, @Body() updateBookingStatusDto: UpdateBookingStatusDto) {
        return this.bookingsService.updateStatus(id, updateBookingStatusDto);
    }
}
