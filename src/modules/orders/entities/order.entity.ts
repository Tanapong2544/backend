import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'buyerId' })
  user: User;

  @Column()
  buyerId: string;

  @Column()
  buyerName: string;

  @Column()
  sellerId: string;

  @Column('decimal')
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'shipping', 'delivered'],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['waiting', 'verified', 'rejected'],
    default: 'waiting',
  })
  paymentStatus: string;

  // Shipping Info
  @Column()
  recipient_name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  sub_district: string;

  @Column()
  zip_code: string;

  // Payment
  @Column()
  paymentSlipUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
