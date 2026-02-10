import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountPrice?: number;

    @IsOptional()
    @IsString()
    discountExpiresAt?: string;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    stock?: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountPrice?: number | null;

    @IsOptional()
    @IsString()
    discountExpiresAt?: string | null;
}
