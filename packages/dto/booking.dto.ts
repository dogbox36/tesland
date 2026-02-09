import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    serviceType: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;
}

export class UpdateBookingStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED'])
    status: string;
}
