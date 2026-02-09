import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Staff } from './staff.entity';
import { OrderDetail } from './order-detail.entity';
import { ORDER_STATUSES, OrderStatus } from '../common/constants/order_statuses';
import { INVOICE_STATUSES, InvoiceStatus } from '../common/constants/invoice_statuses';

@Entity({ name: 'order' }) // reserved word in SQL
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ name: 'customer_code', type: 'varchar' })
  customerCode!: string;

  @Column({ name: 'staff_code', type: 'varchar' })
  staffCode!: string;

  @Column({ name: 'original_amount', type: 'float', default: 0 })
  originalAmount!: number;

  @Column({ type: 'float', default: 0 }) // percentage
  tax!: number;

  @Column({ type: 'float', default: 0 }) // amount, <=0
  discount!: number;

  @Column({ name: 'shipping_fee', type: 'float', default: 0 })
  shippingFee!: number;

  @Column({ name: 'additional_fee', type: 'float', default: 0 })
  additionalFee!: number;

  @Column({ name: 'final_amount', type: 'float' })
  finalAmount!: number;

  @Column({ type: 'enum', enum: ORDER_STATUSES, nullable: true, default: ORDER_STATUSES.PENDING })
  status!: OrderStatus | null;

  @Column({ name: 'invoice_status', type: 'enum', enum: INVOICE_STATUSES, nullable: true })
  invoiceStatus!: InvoiceStatus | null;

  @Column({ name: 'bank_transaction_id', type: 'varchar', nullable: true })
  bankTransactionId!: string | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({ type: 'text', nullable: true, name: 'note' })
  description!: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_code', referencedColumnName: 'code' })
  customer!: Customer;

  @ManyToOne(() => Staff, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'staff_code', referencedColumnName: 'code' })
  staff!: Staff;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  orderDetails!: OrderDetail[];
}
