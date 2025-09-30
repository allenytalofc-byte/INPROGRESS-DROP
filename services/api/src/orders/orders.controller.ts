import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param, 
  Query,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Returns all orders' })
  async findAll(@CurrentUser() user: any, @Query('status') status?: string) {
    const filters: any = { status };
    
    // Customers can only see their own orders
    if (user.role === 'customer') {
      filters.customer_id = user.id;
    }

    return this.ordersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Returns order with items' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('vendor', 'admin')
  @ApiOperation({ summary: 'Update order status (Vendor/Admin only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto.status);
  }
}