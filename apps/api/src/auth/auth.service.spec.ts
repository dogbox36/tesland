import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => 'test-token'),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user data if password matches', async () => {
            const password = 'password';
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { id: '1', email: 'test@example.com', password: hashedPassword, role: 'USER' };

            jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);

            const result = await service.validateUser('test@example.com', password);
            expect(result).toEqual({ id: '1', email: 'test@example.com', role: 'USER' });
        });

        it('should return null if password does not match', async () => {
            const password = 'password';
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { id: '1', email: 'test@example.com', password: hashedPassword, role: 'USER' };

            jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);

            const result = await service.validateUser('test@example.com', 'wrongpassword');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access_token', async () => {
            const user = { id: '1', email: 'test@example.com', password: 'hashed', role: 'USER' };
            jest.spyOn(service, 'validateUser').mockResolvedValue({ id: '1', email: 'test@example.com', role: 'USER' });

            const result = await service.login({ email: 'test@example.com', password: 'password' });
            expect(result).toEqual({
                access_token: 'test-token',
                user: { email: 'test@example.com', sub: '1', role: 'USER' },
            });
        });
    });
});
