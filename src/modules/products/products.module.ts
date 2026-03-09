import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from './entities/product.entity';
import { SellerProfile } from '../sellers/entities/seller.entity';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, SellerProfile])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}