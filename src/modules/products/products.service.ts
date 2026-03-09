import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import * as fs from 'fs';
import { join } from 'path';
import { SellerProfile } from '../sellers/entities/seller.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SellerProfile)
    private readonly sellerRepository: Repository<SellerProfile>,
  ) {}

  async create(productData: any) {
    const seller = await this.sellerRepository.findOne({
      where: { userId: productData.userId },
    });

    if (!seller) {
      throw new Error('ไม่พบข้อมูลร้านค้าสำหรับ User นี้');
    }

    const newProduct = this.productRepository.create({
      ...productData,
      sellerId: seller.id,
      stock: parseInt(productData.stock) || 0,
      price: parseFloat(productData.price) || 0,
    });

    return await this.productRepository.save(newProduct);
  }

  async findAllBySeller(userId: number) {
    const seller = await this.sellerRepository.findOne({
      where: { userId: userId },
    });
    if (!seller) {
      throw new NotFoundException('ไม่พบ seller');
    }
    return await this.productRepository.find({
      where: { sellerId: seller.id },
      relations: ['seller'],
    });
  }

  async findAll() {
    return await this.productRepository.find({
      relations: ['seller'],
    });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`ไม่พบสินค้า ID: ${id}`);
    }
    if (product.image) {
      const filePath = join(process.cwd(), 'uploads/products', product.image);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('ลบไฟล์รูปภาพไม่สำเร็จ:', err);
        }
      }
    }
    await this.productRepository.remove(product);
    return { success: true, message: 'ลบสินค้าและรูปภาพเรียบร้อยแล้ว' };
  }
}
