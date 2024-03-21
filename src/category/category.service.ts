import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseBarberSalonWithImageDto, ResponseCategoryBarberSalonDto } from 'src/home/dto/home.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) { }

    async getBarberSalonsFromCategoryByCategoryId(categoryId: string) {
        const category = await this.prismaService.categories.findUnique(
            {
                where: { id: categoryId },
                include: {
                    barberSalonCategory: {
                        include: { barberSalon: true }
                    }
                }
            }
        )
        if (category) {
            var salonsWithImage = []
            category.barberSalonCategory.map(ca => {
                salonsWithImage.push(
                    new ResponseBarberSalonWithImageDto(
                        {
                            id: ca.barberSalon.id,
                            name: ca.barberSalon.name,
                            address: ca.barberSalon.address,
                            profileImage: ca.barberSalon.profileImage.startsWith('http') ? ca.barberSalon.profileImage : `${process.env.URL}/home/images/${ca.barberSalon.profileImage}`,
                            openStatus: ca.barberSalon.openStatus,
                            rate: ca.barberSalon.rate,
                            website: ca.barberSalon.website,
                        }
                    )
                )
            })
            return new ResponseCategoryBarberSalonDto(
                {
                    ...category, categoryImage: category.categoryImage.startsWith('http') ? category.categoryImage : `${process.env.URL}/home/images/${category.categoryImage}`,
                    barberSalons: salonsWithImage,
                },
            );
        } else {
            throw new NotFoundException()
        }

    }
}
