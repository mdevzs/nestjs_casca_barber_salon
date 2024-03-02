import { Exclude } from "class-transformer"

export class HomeResponseDto {
    user: { fullname: string }
    banners: {}
    categories: {}
    nearByYourLocation: {}


    constructor(partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial)
    }
}

export class ResponseBannerDto {
    bannerImage: string

    constructor(partial: Partial<ResponseBannerDto>) {
        Object.assign(this, partial)
    }
}

export class ResponseCategoriesDto {
    categoryImage: string

    constructor(partial: Partial<ResponseCategoriesDto>) {
        Object.assign(this, partial)
    }
}

export class ResponseCategoryBarberSalonDto {
    categoryImage: string
    barberSalons: {}
    @Exclude()
    barberSalonCategory: {}

    constructor(partial: Partial<ResponseCategoryBarberSalonDto>) {
        Object.assign(this, partial)
    }
}

export class ResponseBarberSalonWithImageDto {
    id: number
    name: string
    address: string
    profileImage: string
    rate: number
    openStatus: boolean
    website: string
    @Exclude()
    barberSalon: {}    
    @Exclude()
    barberSalonId: {}
    @Exclude()
    categoryId: {}
    constructor(partial: Partial<ResponseBarberSalonWithImageDto>) {
        Object.assign(this, partial)
    }
}