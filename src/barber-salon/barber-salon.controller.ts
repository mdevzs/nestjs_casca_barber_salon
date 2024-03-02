import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { BarberSalonService } from './barber-salon.service';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('barber-salon')
export class BarberSalonController {
  constructor(private readonly barberSalonService: BarberSalonService) { }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async home(
    @Param('id') id: string,
    @Req() { user },
  ) {
    return this.barberSalonService.getBarberSalonById(id,user.id);
  }

  @Get('images/:fileId')
  async getfileUpload(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: './uploads/images' });
  }
}
