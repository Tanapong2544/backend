import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('seller')
export class SellerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

//   @OneToOne(() => User, (user) => user.sellerProfile, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'user_id' }) 
//   user: User;

//   @Column()
//   userId: number;
}