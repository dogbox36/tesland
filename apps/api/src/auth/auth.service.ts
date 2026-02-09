import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from '@tesland/dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        try {
            const existingUser = await this.usersService.findOne(registerDto.email);
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const user = await this.usersService.create({
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
            });

            return this.login({ email: user.email, password: registerDto.password });
        } catch (error) {
            console.error('Registration FAILED. Error details:', error);
            if (error instanceof ConflictException) throw error;
            throw error;
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }
}
