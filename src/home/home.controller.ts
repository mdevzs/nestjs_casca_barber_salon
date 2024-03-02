import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }

  @UseGuards(AuthenticationGuard)
  @Get()
  async home(
    @Req() { user },
  ) {
    return this.homeService.home(user.id);
  }

  @Get('images/:fileId')
  async getfileUpload(@Param('fileId') fileId, @Res() res) {
    res.sendFile(fileId, { root: './uploads/images' });
  }
}
