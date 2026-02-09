import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TRANSACTION_TYPES, TransactionType } from '../common/constants/transaction_types';
import { Stock } from './stock.entity';
import { Warehouse } from './warehouse.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'serial_code', type: 'varchar', unique: true })
  serialCode!: string;

  @Column({ name: 'stock_id', type: 'int', nullable: true })
  stockId!: number | null;

  @Column({ type: 'float' })
  cost!: number;

  @Column({ type: 'int' }) // 1 or -1
  quantity!: number;

  @Column({ type: 'varchar', nullable: true }) // pack, box, ...
  unit!: string | null;

  @Column({ name: 'warehouse_code', type: 'varchar', nullable: true })
  warehouseCode!: string | null;

  @Column({ name: 'transaction_type', type: 'enum', enum: TRANSACTION_TYPES, nullable: false }) // IN, OUT
  transactionType!: TransactionType;

  @Column({ type: 'text', nullable: true, name: 'note' })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Stock, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stock_id' })
  stock!: Stock;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_code', referencedColumnName: 'code' })
  warehouse!: Warehouse;
}

