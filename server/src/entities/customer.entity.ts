import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CUSTOMER_TYPES, CustomerType } from '../common/constants/customer_types';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'code', type: 'varchar' })
  code!: string;

  @Column({ name: 'name', type: 'varchar' })
  name!: string;

  @Column({ nullable: true, name: 'email', type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, name: 'mobile', type: 'varchar' })
  mobile!: string | null;

  @Column({ nullable: true, name: 'type', type: 'enum', enum: CUSTOMER_TYPES, default: CUSTOMER_TYPES.B2C })
  type!: CustomerType | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}