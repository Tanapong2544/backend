import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { SellerProfile } from './modules/sellers/entities/seller.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ProductEntity } from './modules/products/entities/product.entity';
import { AddressModule } from './modules/address/address.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', 
      password: '250744', 
      database: 'project',
      entities: [User, SellerProfile, ProductEntity],
      autoLoadEntities: true,
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    AddressModule,
    CartModule,
    OrdersModule,
    PaymentsModule, 

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
