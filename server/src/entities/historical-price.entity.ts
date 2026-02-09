import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('historical_price')
export class HistoricalPrice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'item_code' })
  itemCode!: string;

  @Column({ name: 'channel', type: 'varchar', nullable: true })
  channel!: string | null;

  @Column({ type: 'float' })
  price!: number;

  @Column({ type: 'float', default: 0 }) // percentage
  tax!: number;

  @Column({ name: 'additional_fee', type: 'float', default: 0 })
  additionalFee!: number;

  @Column({ name: 'final_price', type: 'float' })
  finalPrice!: number;

  @Column({ name: 'from_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  from!: Date;

@Column({ name: 'to_date', type: 'timestamp', nullable: true })
  to!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_code', referencedColumnName: 'itemCode' })
  item!: Item;
}
