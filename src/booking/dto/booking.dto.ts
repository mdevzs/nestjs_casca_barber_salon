import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class BookingDto {
    @IsNotEmpty()
    @IsNumber()
    barberSalonId: number
    
    @IsNotEmpty()
    @IsDate()
    bookingDate: Date

    @IsNotEmpty()
    @IsString()
    bookingHour: string

    @IsNotEmpty()
    @IsNumber()
    specialUserId: number

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    packageId?: number

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    serviceTypes?: Array<number>
}