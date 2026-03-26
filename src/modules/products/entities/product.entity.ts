import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SellerProfile } from '../../sellers/entities/seller.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('int')
  stock: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  sellerId: number;

  @ManyToOne(() => SellerProfile, (seller) => seller.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sellerId' })
  seller: SellerProfile;
}
