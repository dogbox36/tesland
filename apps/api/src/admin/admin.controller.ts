import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private prisma: PrismaService) { }

    @Get('stats')
    @Roles('ADMIN')
    async getStats() {
        const userCount = await this.prisma.user.count();
        const profilesCount = await this.prisma.profile.count();

        return {
            users: userCount,
            profiles: profilesCount,
            activeSessions: 0 // Placeholder
        };
    }
}
