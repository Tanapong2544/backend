import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateStatusDto } from './dto/update-order.dto';
import { UpdatePaymentDto } from './dto/ีupdate-payment.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('user')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('slip', {
      storage: diskStorage({
        destination: './uploads/slips',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `slip-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    const user = req.user;
    // console.log('Final check of req.user:', user);

    if (!user || !user.userId) {
      throw new UnauthorizedException(
        'ไม่สามารถเข้าถึงข้อมูลผู้ใช้ได้ (User undefined)',
      );
    }
    const { items, ...orderInfo } = body;
    const orderData = {
      ...orderInfo,
      buyerId: req.user.userId,
      buyerName: req.user.firstName + ' ' + req.user.lastName,
      paymentSlipUrl: file ? file.filename : null,
      totalAmount: parseFloat(body.totalAmount),
      status: 'pending',
    };
    const cartItems = JSON.parse(items);
    return this.ordersService.create(orderData, cartItems);
  }

  @Roles('seller')
  @Get('seller/my-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMyOrders(@Req() req: any) {
    const sellerId = req.user.userId;
    return this.ordersService.findOrdersBySeller(sellerId);
  }

  @Roles('seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('seller/update/:id')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: any,
  ) {
    const sellerUserId = req.user.userId;
    return this.ordersService.updateOrderStatus(
      id,
      sellerUserId,
      updateStatusDto.status,
    );
  }

  @Roles('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-orders')
  async orders(@Req() req: any) {
    const buyerId = req.user.userId;
    return this.ordersService.findOrdersByBuyer(buyerId);
  }

  @Roles('admin')
  @Get('admin/all-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllOrdersForAdmin() {
    return this.ordersService.findAllOrders();
  }

  @Roles('admin')
  @Patch('admin/verify-payment/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async verifyPayment(
    @Param('orderId') orderId: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.ordersService.updatePaymentStatus(
      orderId,
      updatePaymentDto.status,
    );
  }
}
