import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseBarberSalonWithImageDto } from 'src/home/dto/home.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiscoverService {
    constructor(private readonly prismaService: PrismaService) { }

    async discover(search: string, categoryId: string, rateQ: string) {
        console.log(rateQ);
        if (categoryId !== undefined) {
            const categoryBarberSalons = await this.prismaService.categories.findUnique(
                {
                    where: {
                        id: categoryId,
                    },
                    include: {
                        barberSalonCategory: {
                            where: {
                                barberSalon: {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive'
                                    },
                                    rate: { equals: rateQ !== undefined ? parseInt(rateQ) : undefined }
                                }
                            },
                            include: {
                                barberSalon: true
                            }
                        }
                    }
                }
            )
            //if (categoryBarberSalons) {
            var salonsWithImage = []
            categoryBarberSalons.barberSalonCategory.map(ca => {
                salonsWithImage.push(
                    new ResponseBarberSalonWithImageDto(
                        {
                            id: parseInt(ca.barberSalon.id),
                            name: ca.barberSalon.name,
                            address: ca.barberSalon.address,
                            profileImage: `http://192.168.0.103:3500/home/images/${ca.barberSalon.profileImage}`,
                            openStatus: ca.barberSalon.openStatus,
                            rate: ca.barberSalon.rate,
                            website: ca.barberSalon.website,
                        }
                    )
                )
            })
            return salonsWithImage;
            //} else {
            //    throw new NotFoundException()
            // }

        } else {
            //return all barberSalons from all categories base on search and rate
            const categoriesBarberSalons = await this.prismaService.categories.findMany(
                {
                    include: {
                        barberSalonCategory: {
                            where: {
                                barberSalon: {
                                    name: {
                                        contains: search,
                                        mode: 'insensitive'
                                    },
                                    rate: { equals: rateQ !== undefined ? parseInt(rateQ) : undefined }
                                }
                            },
                            include: {
                                barberSalon: true
                            }
                        }
                    }
                },
            )
            //if (categoriesBarberSalons) {
            var salonsWithImage = []
            categoriesBarberSalons.map(b => {
                b.barberSalonCategory.map(ca => {
                    salonsWithImage.push(
                        new ResponseBarberSalonWithImageDto(
                            {
                                id: parseInt(ca.barberSalon.id),
                                name: ca.barberSalon.name,
                                address: ca.barberSalon.address,
                                profileImage: `http://192.168.0.103:3500/home/images/${ca.barberSalon.profileImage}`,
                                openStatus: ca.barberSalon.openStatus,
                                rate: ca.barberSalon.rate,
                                website: ca.barberSalon.website,
                            }
                        )
                    )
                })
            })
            return salonsWithImage;
            //} else {
            //    throw new NotFoundException()
            //}
        }
    }
}
