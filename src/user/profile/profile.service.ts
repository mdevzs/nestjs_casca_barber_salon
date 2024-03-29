import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfileDto, ResponseProfileDto } from './dto/profile.dto';
import { UserResponseDto } from '../auth/dtos/auth.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly prismaService: PrismaService) { }

    async profile(profileId: string) {
        console.log(`profileId is:${profileId}`)
        const user = await this.prismaService.users.findUnique({
            where: {
                id: profileId
            },
        })

        if (!user) {
            throw new NotFoundException()
        }

        return new ResponseProfileDto({
            ...user,
            profileImage: user.profileImage !== null && user.profileImage.startsWith('http') ? user.profileImage : user.profileImage !== null ? `${process.env.URL}/profile/images/${user.profileImage}` : null,
        },);
    }

    async updateProifle(
        profileId: string,
        profileImage: Express.Multer.File,
        { fullName, nickname, email, phone, dateOfBirth, address, gender }: EditProfileDto,
    ) {

        const user = await this.prismaService.users.findUnique({
            where: { id: profileId },
        })

        const updateUser = await this.prismaService.users.update({
            data: {
                fullName,
                nickname,
                email,
                phone,
                dateOfBirth,
                address, gender,
                profileImage: profileImage != undefined ? profileImage.filename : user.profileImage,
            },
            where: {
                id: profileId.toString()
            }
        })
        return new UserResponseDto({
            ...updateUser,
            profileImage: updateUser.profileImage != null && updateUser.profileImage.startsWith('http') ? updateUser.profileImage : updateUser.profileImage !== null ? `${process.env.URL}/profile/images/${updateUser.profileImage}` : null,
        });

    }
}

