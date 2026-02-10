import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '@tesland/dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createOrderDto: any) {
        console.log('Creating order for user:', userId);
        console.log('Order Items:', JSON.stringify(createOrderDto.items, null, 2));

        return this.prisma.$transaction(async (tx) => {
            let total = 0;
            const orderItemsData = [];

            for (const item of (createOrderDto.items as any[])) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new BadRequestException(`Product with ID ${item.productId} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for product ${product.name}`);
                }

                // Determine price (check if discount is active)
                let price = product.price;
                if (product.discountPrice && (!product.discountExpiresAt || new Date(product.discountExpiresAt) > new Date())) {
                    price = product.discountPrice;
                }

                total += price * item.quantity;
                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: price,
                });

                // Deduct stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: product.stock - item.quantity },
                });
            }

            // Create Order
            const order = await tx.order.create({
                data: {
                    userId,
                    total,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData,
                    },
                },
                include: {
                    items: true,
                },
            });

            return order;
        });
    }

    findAll() {
        return this.prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } }
            }
        });
    }
}
