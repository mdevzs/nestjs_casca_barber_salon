import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PackagesService {
    constructor(private readonly prismaService: PrismaService) { }

    async getBarberSalonPackages(barberSalonId: string) {
        const packagesT = await this.prismaService.packages.findMany(
            {
                where: { barberSalonId: barberSalonId },
                include: {
                    servicePackage: {
                        include: { services: true }
                    }
                }
            }
        )
        const packages = []
        var services = []
        packagesT.map(pac => {
            pac.servicePackage.map(s => {
                services.push({
                    id: s.services.id,
                    serviceName: s.services.serviceName,
                })
            })
            packages.push(
                {
                    ...pac,
                    servicePackage: services,
                    packageImage: pac.packageImage !== null && pac.packageImage.startsWith('http') ? pac.packageImage : `${process.env.URL}/barber-salon/images/${pac.packageImage}`
                }
            )
            services = []
        })
        return packages;
    }
}
