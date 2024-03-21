import { Injectable } from '@nestjs/common';
import { ServiceTypsGender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicesService {
    constructor(private readonly prismaService: PrismaService) { }

    async getBarberSalonServices(barberSalonId: string) {
        const servicesT = await this.prismaService.services.findMany({
            where: {
                barberSalonId: barberSalonId
            },
            include: {
                types: true
            }
        })
        const services = []
        var types = {}
        var manTypes = []
        var womanTypes = []
        servicesT.map(s => {
            s.types.map(t => {
                if (t.gender === ServiceTypsGender.Man) {
                    manTypes.push(
                        {
                            ...t,
                            typeImage: t.typeImage !== null && t.typeImage.startsWith('http') ? t.typeImage : `${process.env.URL}/barber-salon/images/${t.typeImage}`
                        }
                    )
                } else {
                    womanTypes.push(
                        {
                            ...t,
                            typeImage: t.typeImage !== null && t.typeImage.startsWith('http') ? t.typeImage : `${process.env.URL}/barber-salon/images/${t.typeImage}`
                        }
                    )
                }
            })
            types = { manTypes, womanTypes }
            services.push({
                ...s, types: types
            })
            manTypes = []
            womanTypes = []
        })
        return services;
    }
}
