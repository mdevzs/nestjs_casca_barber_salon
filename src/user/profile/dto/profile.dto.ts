import { Exclude } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class ResponseProfileDto {
    profileImage: string
    @Exclude()
    password: string

    constructor(partial: Partial<ResponseProfileDto>) {
        Object.assign(this, partial)
    }
}

export class EditProfileDto {
    @IsString()
    @IsOptional()
    fullName: string

    @IsString()
    @IsOptional()
    nickname: string

    @IsString()
    @IsOptional()
    dateOfBirth: string

    @IsString()
    @IsOptional()
    email: string

    @IsString()
    @IsOptional()
    phone: string

    @IsString()
    @IsOptional()
    gender: string

    @IsString()
    @IsOptional()
    address: string
}