import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Item } from './item.entity';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'product_code', type: 'varchar' })
  productCode!: string;

  @Column({ name: 'item_code', type: 'varchar' })
  itemCode!: string;

  @Column({ type: 'text', nullable: true, name: 'note' })
  description!: string | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_code', referencedColumnName: 'code' })
  product!: Product;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_code', referencedColumnName: 'itemCode' })
  item!: Item;
}
