

export class ResponseBarberSalonDto {
    profileImages: {}
    specialList: {}
    aboutUs: {}
    services: {}
    packages: {}
    gallary: {}
    reviews: {}
    constructor(partial: Partial<ResponseBarberSalonDto>) {
        Object.assign(this, partial)
    }
}