import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDto } from './dto/booking.dto';
import { BookingState } from '@prisma/client';

@Injectable()
export class BookingService {
    constructor(private readonly prismaService: PrismaService) { }

    async bookBarberSalon(
        { barberSalonId, bookingDate, bookingHour, specialUserId, packageId, serviceTypes }: BookingDto,
        userId: number,
    ) {
        const bookBSalon = await this.prismaService.booking.create(
            {
                data: {
                    creatorUserId: userId,
                    barberSalonId,
                    bookingDate,
                    bookingHour,
                    specialUserId,
                    serviceTypes,
                    packageId,
                    state: BookingState.UpComing
                }
            }
        )
        const sTypes = []
        if (serviceTypes !== undefined && serviceTypes.length > 0) {
            for (let i = 0; i < serviceTypes.length; i++) {
                const serTypeT = await this.prismaService.serviceTyps.findUnique(
                    {
                        where: {
                            id: serviceTypes[i]
                        }
                    }
                )
                sTypes.push(
                    {
                        id: serTypeT.id,
                        typeName: serTypeT.typeName,
                        price: serTypeT.price,
                    }
                )
            }
        }
        var packge = null
        if (packageId != null) {
            const packageT = await this.prismaService.packages.findUnique(
                {
                    where: { id: packageId }
                }
            )
            packge = packageT;
        }
        return {
            ...bookBSalon,
            serviceTypes: sTypes,
            packge,
        };
    }

    async getAllBooked(userId: number) {
        const allBooked = await this.prismaService.booking.findMany({
            where: {
                creatorUserId: userId
            },
            include: {
                barberSalon: true
            }
        })
        const upComing = []
        const completed = []
        const cancelled = []


        for (let i = 0; i < allBooked.length; i++) {
            const booked = allBooked[i];
            const sTypes = []
            if (booked.serviceTypes.length > 0) {
                for (let i = 0; i < booked.serviceTypes.length; i++) {
                    const serTypeT = await this.prismaService.serviceTyps.findUnique(
                        {
                            where: {
                                id: booked.serviceTypes[i]
                            }
                        }
                    )
                    sTypes.push(
                        {
                            id: serTypeT.id,
                            typeName: serTypeT.typeName,
                            price: serTypeT.price,
                        }
                    )
                }
            }
            var packge = null
            if (booked.packageId != null) {
                const packageT = await this.prismaService.packages.findUnique(
                    {
                        where: { id: booked.packageId }
                    }
                )
                packge = packageT;
            }
            const bookingResponse = {
                ...booked,
                serviceTypes: sTypes,
                packge,
                barberSalon: {
                    ...booked.barberSalon,
                    profileImage: booked.barberSalon.profileImage != null ? `http://192.168.0.103:3500/barber-salon/images/${booked.barberSalon.profileImage}` : null
                }
            }
            if (booked.state === BookingState.UpComing) {
                upComing.push(
                    bookingResponse
                )
            }
            if (booked.state === BookingState.Completed) {
                completed.push(
                    bookingResponse
                )
            }
            if (booked.state === BookingState.Cancelled) {
                cancelled.push(
                    bookingResponse
                )
            }
        }

        return {
            upComing,
            completed,
            cancelled
        }
    }

    async cancelBook(bookingId: number, userId: number,) {
        const bookedExist = await this.prismaService.booking.findUnique(
            {
                where: { id: bookingId }
            }
        )
        if (bookedExist) {
            await this.prismaService.booking.update(
                {
                    where: {
                        id: bookingId,
                        AND: [
                            { creatorUserId: userId }
                        ]
                    },
                    data: {
                        state: BookingState.Cancelled
                    }
                }
            )
        }else{
            throw new NotFoundException()
        }
    }
}
