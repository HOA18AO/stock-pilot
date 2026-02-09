import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Item } from './item.entity';
import { OrderFulfillment } from './order-fulfillment.entity';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId!: number;

  @Column({ name: 'item_code',  })
  itemCode!: string;

  @Column({ type: 'float' })
  price!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'original_amount', type: 'float' })
  originalAmount!: number;

  @Column({ type: 'float', default: 0 })
  discount!: number;

  @Column({ type: 'float', default: 0 })
  tax!: number;

  @Column({ name: 'additional_fee', type: 'float', default: 0 })
  additionalFee!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToOne(() => Order, (order) => order.orderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_code', referencedColumnName: 'itemCode' })
  item!: Item;

  @OneToMany(() => OrderFulfillment, (f) => f.orderDetail)
  orderFulfillments!: OrderFulfillment[];
}
