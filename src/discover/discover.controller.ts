import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) { }

  @UseGuards(AuthenticationGuard)
  @Get()
  async discover(
    @Query('search') search: string,
    @Query('categoryId') categoryId: string,
    @Query('rate') rate: string,
  ) {
    return this.discoverService.discover(search, categoryId, rate);
  }
}
