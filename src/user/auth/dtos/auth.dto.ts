import { Exclude } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator"


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsString()
    @IsNotEmpty()
    nickname: string

    @Matches('^[0][9][0-9][0-9]{8,8}$', '', { message: 'phone must be a valid phone' })
    phone: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(5)
    password: string

    @IsString()
    @IsNotEmpty()
    gender: string

    @IsString()
    @IsNotEmpty()
    dateOfBirth: string
}

export class UserResponseDto {
    fullName: string
    nickname: string
    phone: string
    email: string
    gender: String
    dateOfBirth: string
    profileImage?: string
    token?: string
    @Exclude()
    password: string

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial)
    }
}

export class SigninDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}