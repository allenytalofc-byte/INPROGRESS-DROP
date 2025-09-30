import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  async list(@Req() req: any) {
    return this.orders.listByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  async listAll() {
    return this.orders.listAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.orders.get(id);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body()
    body: { items: Array<{ product_id: string; quantity: number; price_cents: number }>; currency?: string },
  ) {
    return this.orders.create(req.user.id, body.items || [], body.currency || 'USD');
  }
}