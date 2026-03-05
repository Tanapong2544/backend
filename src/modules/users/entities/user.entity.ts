import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

export enum UserRole {
  USER = 'user', 
  ADMIN = 'admin',  
  SELLER = 'seller', 
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  // ความสัมพันธ์กับ Seller Profile (ถ้ามี)
  // @OneToOne(() => SellerProfile, (sellerProfile) => sellerProfile.user)
  // sellerProfile: SellerProfile;
}