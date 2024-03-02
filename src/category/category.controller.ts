import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthenticationGuard } from 'src/user/guards/authentication.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async getBarberSalonsFromCategoryByCategoryId(
    @Param('id') categoryId: string,
  ) {
    return this.categoryService.getBarberSalonsFromCategoryByCategoryId(categoryId);
  }
}
