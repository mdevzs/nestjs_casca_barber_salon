import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto, UserResponseDto } from './dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    async signup({ fullName, nickname, email, phone, password, gender, dateOfBirth }: SignupDto, image: Express.Multer.File) {

        const emailExitst = await this.prismaService.users.findUnique({
            where: {
                email
            }
        })
        const phoneExist = await this.prismaService.users.findUnique({
            where: {
                phone,
            },
        })
        if (emailExitst) {
            throw new ConflictException('The email already taken!')
        }
        if (phoneExist) {
            throw new ConflictException('User exist with this phone please choose another phone number!')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.prismaService.users.create({
            data: {
                fullName,
                nickname,
                email,
                phone,
                password: hashedPassword,
                dateOfBirth,
                gender,
                profileImage: image != undefined ? image.filename : null,
                userType: UserType.user
            }
        })
        const token = await this.generateJWT(user.id, user.fullName)
        return new UserResponseDto({
            ...user,
            profileImage: user.profileImage != null ? `http://192.168.0.103:3000/profile/images/${user.profileImage}` : null,
            token,
        });
    }

    async signin({ email, password }: SigninDto) {
        const userExist = await this.prismaService.users.findUnique({
            where: {
                email
            }
        })

        if (!userExist) {
            throw new HttpException("Invalid Credential", 400)
        }

        const hashedPassword = userExist.password
        const isPasswordValid = await bcrypt.compare(password, hashedPassword)

        if (!isPasswordValid) {
            throw new HttpException("Invalid Credential", 400)
        }

        const token = await this.generateJWT(userExist.id, userExist.fullName)
        return new UserResponseDto({
            ...userExist,
            profileImage: userExist.profileImage != null ? `http://192.168.0.103:3000/profile/images/${userExist.profileImage}` : null,
            token
        })
    }

    private generateJWT(id: number, name: string) {
        return this.jwtService.signAsync({ 'id': id, 'name': name })
    }
}
