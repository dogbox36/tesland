import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class CreateQuoteDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    serviceType: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}

export class UpdateQuoteStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(['PENDING', 'REPLIED', 'ARCHIVED'])
    status: string;
}
