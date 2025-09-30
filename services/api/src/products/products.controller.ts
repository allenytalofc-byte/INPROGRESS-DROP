import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  async list() {
    return this.products.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.products.get(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @Post()
  async create(
    @Body()
    body: { title: string; description?: string; price_cents: number; currency?: string; image_url?: string; stock?: number; vendor_id?: string | null },
  ) {
    return this.products.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{ title: string; description: string; price_cents: number; currency: string; image_url: string; stock: number }>,
  ) {
    return this.products.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.products.remove(id);
  }
}