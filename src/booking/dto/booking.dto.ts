import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class BookingDto {
    @IsNotEmpty()
    @IsNumber()
    barberSalonId: string
    
    @IsNotEmpty()
    @IsDate()
    bookingDate: Date

    @IsNotEmpty()
    @IsString()
    bookingHour: string

    @IsNotEmpty()
    @IsNumber()
    specialUserId: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    packageId?: string

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    serviceTypes?: Array<string>
}