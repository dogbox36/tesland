import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '@tesland/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req, @Body() createOrderDto: any) {
        console.log('Incoming Order Payload:', JSON.stringify(createOrderDto, null, 2));

        // Manual validation fallback
        if (!createOrderDto.items || !Array.isArray(createOrderDto.items)) {
            throw new Error('Invalid items format');
        }

        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}
