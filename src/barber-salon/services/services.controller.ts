import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('barber-salon')
export class ServicesController {
    constructor(private readonly services: ServicesService) { }

    @UseGuards(AuthenticationGuard)
    @Get(':id/services')
    async getBarberSalonServices(
        @Param('id') barberSalonId: string,
    ) {
        return this.services.getBarberSalonServices(barberSalonId)
    }

}
