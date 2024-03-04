import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('barber-salon')
export class PackagesController {
    constructor(private readonly packages: PackagesService) { }

    @UseGuards(AuthenticationGuard)
    @Get(':id/packages')
    async getBarberSalonPackages(
        @Param('id') barberSalonId: string,
    ) {
        return this.packages.getBarberSalonPackages(barberSalonId)
    }
}
