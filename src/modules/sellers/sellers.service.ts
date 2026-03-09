import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerProfile } from './entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerProfile)
    private sellerRepository: Repository<SellerProfile>,
  ) {}

  async create(data: {
    userId: number;
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    const seller = this.sellerRepository.create(data);
    return await this.sellerRepository.save(seller);
  }

  async findAll() {
    return await this.sellerRepository.find();
  }

  async findOne(id: number) {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!seller) {
      return `ไม่พบ Seller ที่มี ID: ${id}`;
    }
    return seller;
  }
}
