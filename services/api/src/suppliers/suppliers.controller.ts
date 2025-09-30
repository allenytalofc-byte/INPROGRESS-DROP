import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create supplier profile' })
  @ApiResponse({ status: 201, description: 'Supplier profile created successfully' })
  create(@Body() createSupplierDto: CreateSupplierDto, @Request() req) {
    return this.suppliersService.create(createSupplierDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all suppliers (Admin only)' })
  @ApiResponse({ status: 200, description: 'Suppliers retrieved successfully' })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current supplier profile' })
  @ApiResponse({ status: 200, description: 'Supplier profile retrieved successfully' })
  findMyProfile(@Request() req) {
    return this.suppliersService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get supplier by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Supplier retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current supplier profile' })
  @ApiResponse({ status: 200, description: 'Supplier profile updated successfully' })
  updateMyProfile(@Request() req, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.findByUserId(req.user.id).then(supplier => 
      this.suppliersService.update(supplier.id, updateSupplierDto)
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update supplier by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully' })
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify supplier (Admin only)' })
  @ApiResponse({ status: 200, description: 'Supplier verified successfully' })
  verify(@Param('id') id: string) {
    return this.suppliersService.verify(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete supplier (Admin only)' })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully' })
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}