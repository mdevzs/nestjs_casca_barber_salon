import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto, ResponseBannerDto, ResponseBarberSalonWithImageDto, ResponseCategoriesDto, ResponseCategoryBarberSalonDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) { }

  async home(userId: string) {
    console.log(`userId is:${userId}`)
    const user = await this.prismaService.users.findUnique(
      { where: { id: userId } }
    )
    const banners = await this.prismaService.banners.findMany()
    const bannersImage = banners.map(banner => new ResponseBannerDto({ ...banner, bannerImage: banner.bannerImage.startsWith('http') ? banner.bannerImage : `${process.env.URL}/home/images/${banner.bannerImage}` }))
    const categories = await this.prismaService.categories.findMany()
    const categoriesImage = categories.map(category => new ResponseCategoriesDto({ ...category, categoryImage: category.categoryImage.startsWith('http') ? category.categoryImage : `${process.env.URL}/home/images/${category.categoryImage}` }))
    const nearbyYourLocationBarberSalons = await this.prismaService.categories.findMany(
      {
        include: {
          barberSalonCategory: {
            include: { barberSalon: true }
          }
        }
      }
    )
    var categoryWithBarberSalons = []
    var salonsWithImage = []
    nearbyYourLocationBarberSalons.map(b => {
      b.barberSalonCategory.map(ca => {
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
      categoryWithBarberSalons.push(
        new ResponseCategoryBarberSalonDto(
          {
            ...b, categoryImage: b.categoryImage.startsWith('http') ? b.categoryImage : `${process.env.URL}/home/images/${b.categoryImage}`,
            barberSalons: salonsWithImage,
          },
        ),
      )
      salonsWithImage = []
    })

    return new HomeResponseDto({
      user: { fullname: user.fullName },
      banners: bannersImage,
      categories: categoriesImage,
      nearByYourLocation: categoryWithBarberSalons
    });

  }
}
