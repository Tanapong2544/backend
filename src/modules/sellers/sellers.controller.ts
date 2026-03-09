// sellers/sellers.controller.ts
import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Roles('admin', 'seller')
  @Get()
  async getAllSellers() {
    return await this.sellersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Get(':id')
  async getSellerById(@Param('id') id: string) {
    return await this.sellersService.findOne(+id);
  }
}
