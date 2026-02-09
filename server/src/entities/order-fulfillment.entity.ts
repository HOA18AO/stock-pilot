import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('order_fulfillment')
export class OrderFulfillment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_code', type: 'varchar' })
  orderCode!: string;

  @Column({ name: 'order_detail_id', type: 'int' })
  orderDetailId!: number;

  @Column({ name: 'serial_code', type: 'varchar' })
  serialCode!: string;

  @Column({ type: 'int' }) // 1 or -1
  quantity!: number;

  @Column({ type: 'float', default: 0 })
  cost!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order_code', referencedColumnName: 'code' })
  order!: Order;

  @ManyToOne(() => OrderDetail, (detail) => detail.orderFulfillments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_detail_id' })
  orderDetail!: OrderDetail;
}
