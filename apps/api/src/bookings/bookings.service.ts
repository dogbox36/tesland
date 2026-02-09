import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '@tesland/dto';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    create(userId: string, createBookingDto: CreateBookingDto) {
        return this.prisma.booking.create({
            data: {
                userId,
                serviceType: createBookingDto.serviceType,
                date: new Date(createBookingDto.date),
                status: 'PENDING'
            },
        });
    }

    findAll() {
        return this.prisma.booking.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { date: 'asc' }
        });
    }

    findMyBookings(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
    }

    updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto) {
        return this.prisma.booking.update({
            where: { id },
            data: { status: updateBookingStatusDto.status },
        });
    }
}
