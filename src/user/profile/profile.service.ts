import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfileDto, ResponseProfileDto } from './dto/profile.dto';
import { UserResponseDto } from '../auth/dtos/auth.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly prismaService: PrismaService) { }

    async profile(profileId: number) {
        const user = await this.prismaService.users.findUnique({
            where: {
                id: profileId
            },
        })

        return new ResponseProfileDto({
            ...user,
            profileImage: user.profileImage != null ? `http://192.168.0.103:3000/profile/images/${user.profileImage}` : null,
        },);
    }

    async updateProifle(
        profileId: number,
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
                id: profileId
            }
        })
        return new UserResponseDto({
            ...updateUser,
            profileImage: updateUser.profileImage != null ? `http://192.168.0.103:3000/profile/images/${updateUser.profileImage}` : null,
        });

    }
}

