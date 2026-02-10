import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto, UpdateQuoteStatusDto } from '@tesland/dto';

@Injectable()
export class QuotesService {
    constructor(private prisma: PrismaService) { }

    create(createQuoteDto: CreateQuoteDto) {
        return this.prisma.quote.create({
            data: {
                ...createQuoteDto,
                status: 'PENDING'
            },
        });
    }

    findAll() {
        return this.prisma.quote.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    updateStatus(id: string, updateQuoteStatusDto: UpdateQuoteStatusDto) {
        return this.prisma.quote.update({
            where: { id },
            data: { status: updateQuoteStatusDto.status },
        });
    }
}
