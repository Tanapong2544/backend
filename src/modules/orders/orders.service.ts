// orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { SellerProfile } from '../sellers/entities/seller.entity';
import { UpdateStatusDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(SellerProfile)
    private sellerRepository: Repository<SellerProfile>,
  ) {}

  async create(orderData: any, cartItems: any[]) {
    const count = await this.orderRepository.count();
    const nextNumber = count + 1;

    const orderNumber = `ORD-${nextNumber.toString().padStart(4, '0')}`;

    const items = cartItems.map((item) => {
      const orderItem = new OrderItem();
      orderItem.productId = item.productId;
      orderItem.productName = item.productName;
      orderItem.price = item.price;
      orderItem.quantity = item.quantity;
      return orderItem;
    });

    const newOrder = this.orderRepository.create({
      ...orderData,
      orderNumber: orderNumber,
      items: items,
    });

    return await this.orderRepository.save(newOrder);
  }

  async findOrdersBySeller(currentUserId: number) {
    const seller = await this.sellerRepository.findOne({
      where: { userId: currentUserId },
    });

    if (!seller) {
      throw new NotFoundException('ไม่พบข้อมูลร้านค้าสำหรับผู้ใช้นี้');
    }

    return await this.orderRepository.find({
      where: {
        sellerId: seller.id.toString(),
        paymentStatus: 'verified',
      },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(
    orderId: string,
    currentUserId: number,
    newStatus: UpdateStatusDto['status'],
  ) {
    const seller = await this.sellerRepository.findOne({
      where: { userId: currentUserId },
    });

    if (!seller) {
      throw new NotFoundException('ไม่พบข้อมูลร้านค้า');
    }

    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        sellerId: seller.id.toString(),
        paymentStatus: 'verified',
      },
    });

    if (!order) {
      throw new NotFoundException('ไม่พบออเดอร์นี้ในร้านของคุณ');
    }

    order.status = newStatus;
    return await this.orderRepository.save(order);
  }

  async findOrdersByBuyer(buyerId: number) {
    return await this.orderRepository.find({
      where: {
        buyerId: buyerId.toString(),
      },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllOrders() {
    return await this.orderRepository.find({
      relations: ['user', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updatePaymentStatus(
    orderId: number,
    status: 'waiting' | 'verified' | 'rejected',
  ) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId.toString() },
    });

    if (!order) {
      throw new NotFoundException(`ไม่พบคำสั่งซื้อหมายเลข ${orderId}`);
    }
    order.paymentStatus = status;

    return await this.orderRepository.save(order);
  }
}
