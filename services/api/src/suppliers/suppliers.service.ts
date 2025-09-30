import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto, userId: number): Promise<Supplier> {
    const supplier = this.suppliersRepository.create({
      ...createSupplierDto,
      user_id: userId,
    });
    return this.suppliersRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async findByUserId(userId: number): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });
    if (!supplier) {
      throw new NotFoundException('Supplier profile not found');
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateSupplierDto);
    return this.suppliersRepository.save(supplier);
  }

  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    await this.suppliersRepository.remove(supplier);
  }

  async verify(id: number): Promise<Supplier> {
    const supplier = await this.findOne(id);
    supplier.is_verified = true;
    return this.suppliersRepository.save(supplier);
  }
}