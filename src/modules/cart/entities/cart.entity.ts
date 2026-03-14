import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;
    
  @Column()
  userId: number;

@Column()
  productId: number;

@Column()
  quantity: number;
}