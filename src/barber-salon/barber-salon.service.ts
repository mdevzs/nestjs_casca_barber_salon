import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBarberSalonDto } from './dto/barber-salon.dto';
import { formatDistance } from 'date-fns';

@Injectable()
export class BarberSalonService {
    constructor(private readonly prismaService: PrismaService) { }

    async getBarberSalonById(id: string, userId: number) {
        const barberSalon = await this.prismaService.barberSalons.findUnique(
            {
                where: { id: id }
            }
        )
        const barberSalonsProfileImagesT = await this.prismaService.barberSalonBannerImages.findMany({
            where: {
                barberSalonId: id
            }
        })
        const barberSalonsProfileImages = []
        barberSalonsProfileImagesT.map(img => {
            barberSalonsProfileImages.push(
                { ...img, bannerImage: img.bannerImage != null && img.bannerImage.startsWith('http') ? img.bannerImage : `${process.env.URL}/barber-salon/images/${img.bannerImage}` }
            )
        })
        const specialListUserT = await this.prismaService.userBarberSalon.findMany({
            where: {
                barberSalonId: id
            },
            include: {
                user: true
            }
        })
        const specialListUser = []
        specialListUserT.map(s => {
            specialListUser.push(
                {
                    ...s,
                    user: {
                        profileImage: s.user.profileImage !== null && s.user.profileImage.startsWith('http') ? s.user.profileImage : `${process.env.URL}/barber-salon/images/${s.user.profileImage}`,
                        nickname: s.user.nickname,
                    }
                }
            )
        })
        // it's not a solution but working for now
        //todo fix this
        const workingHours = [
            {
                "Monday":
                    [
                        { "Start": "0800", "Finish": "2100" },
                    ]
            },
            {
                "Tuesday":
                    [
                        { "Start": "0800", "Finish": "2100" },
                    ]
            },
            {
                "Wednesday":
                    [
                        { "Start": "0800", "Finish": "2100" },
                    ]
            },
            {
                "Thursday":
                    [
                        { "Start": "0800", "Finish": "2100" },
                    ]
            },
            {
                "Friday":
                    [
                        { "Start": "0800", "Finish": "2100" },
                    ]
            },
            {
                "Saturday":
                    [
                        { "Start": "1000", "Finish": "2000" },
                    ]
            },
            {
                "Sunday":
                    [
                        { "Start": "1000", "Finish": "2000" },
                    ]
            }
        ]

        const aboutUs = await this.prismaService.aboutUs.findUnique(
            {
                where: { barberSalonId: id }
            }
        )

        const servicesT = await this.prismaService.services.findMany({
            include: {
                types: true
            }
        })
        const services = []
        var types = []
        servicesT.map(s => {
            s.types.map(t => {
                types.push(
                    {
                        ...t,
                        typeImage: t.typeImage !== null && t.typeImage.startsWith('http') ? t.typeImage : `${process.env.URL}/barber-salon/images/${t.typeImage}`
                    }
                )
            })
            services.push({
                ...s, types: types
            })
            types = []
        })

        const packagesT = await this.prismaService.packages.findMany(
            {
                where: { barberSalonId: id }
            }
        )
        const packages = [];
        packagesT.map(pac => {
            packages.push(
                {
                    ...pac,
                    packageImage: pac.packageImage !== null && pac.packageImage.startsWith('http') ? pac.packageImage : `${process.env.URL}/barber-salon/images/${pac.packageImage}`
                }
            )
        })

        const gallariesT = await this.prismaService.barberSalonBannerGallary.findMany(
            {
                where: { barberSalonId: id }
            }
        )
        const gallaries = [];
        gallariesT.map(gallary => {
            gallaries.push(
                {
                    ...gallary,
                    gallaryImage: gallary.gallaryImage !== null && gallary.gallaryImage.startsWith('http') ? gallary.gallaryImage : `${process.env.URL}/barber-salon/images/${gallary.gallaryImage}`
                }
            )
        })

        const reviewLikesT = await this.prismaService.reviewLike.findMany()
        const reviewT = await this.prismaService.reviews.findMany(
            {
                where: {
                    barberSalonId: id
                },
                include: { creator: true }
            }
        )
        const reviews = []
        for (let i = 0; i < reviewT.length; i++) {
            var currentUserLiked = false
            const re = reviewT[i]
            const reviewLikeCounts = await this.getReviewLikes(parseInt(re.id))

            //ckeck if the current use like the review
            for (let j = 0; j < reviewLikesT.length; j++) {
                const element = reviewLikesT[j];
                if (re.id === element.reviewId) {
                    if (element.userId === userId.toString()) {
                        currentUserLiked = true
                        break;
                    }
                }
            }

            reviews.push(
                {
                    ...re,
                    createdAt: `${formatDistance(Date.now(), re.createdAt)} ago`,
                    likeCounts: reviewLikeCounts,
                    currentUserLiked,
                    creator: {
                        id: re.creatorId,
                        fullName: re.creator.fullName,
                        profileImage: re.creator.profileImage !== null && re.creator.profileImage.startsWith('http') ? re.creator.profileImage : `${process.env.URL}/barber-salon/images/${re.creator.profileImage}`,
                    }
                },
            )
        }

        return new ResponseBarberSalonDto({
            ...barberSalon,
            profileImages: barberSalonsProfileImages,
            specialList: specialListUser,
            aboutUs: { ...aboutUs, workingHours },
            services,
            packages,
            gallary: gallaries,
            reviews
        });
    }

    async getReviewLikes(reviewId: number) {
        const reviewLikeCounts = await this.prismaService.reviewLike.count({
            where: {
                reviewId: reviewId.toString()
            }
        })

        return reviewLikeCounts;
    }
}

