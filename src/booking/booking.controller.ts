import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async bookBarberSalon(
    @Body() body: BookingDto,
    @Req() { user }
  ) {
    return this.bookingService.bookBarberSalon(body, user.id)
  }

  @UseGuards(AuthenticationGuard)
  @Get('/get-all')
  async allBooked(
    @Req() { user }
  ) {
    return this.bookingService.getAllBooked(user.id)
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id/cancel')
  async cancelBook(
    @Req() { user },
    @Param('id') bookingId: number,
  ) {
    return this.bookingService.cancelBook(bookingId, user.id)
  }
}
