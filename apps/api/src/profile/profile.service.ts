import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '@tesland/dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user) return null;

        // Return flattened profile data
        return {
            ...user,
            phone: user.profile?.phone,
            address: user.profile?.address,
        };
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        // Update User name if provided
        if (dto.name) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { name: dto.name },
            });
        }

        // Upsert Profile data (create if not exists, update if exists)
        const profileData: any = {};
        if (dto.phone !== undefined) profileData.phone = dto.phone;
        if (dto.address !== undefined) profileData.address = dto.address;

        if (Object.keys(profileData).length > 0) {
            await this.prisma.profile.upsert({
                where: { userId },
                create: {
                    userId,
                    ...profileData
                },
                update: profileData,
            });
        }

        return this.getProfile(userId);
    }
}
