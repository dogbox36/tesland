import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '@tesland/dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    findAll() {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }

    update(id: string, updateProductDto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    remove(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
