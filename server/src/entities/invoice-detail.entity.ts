import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Item } from './item.entity';

@Entity('invoice_detail')
export class InvoiceDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'invoice_id', type: 'int' })
  invoiceId!: number;

  @Column({ name: 'item_code', type: 'varchar' })
  itemCode!: string;

  @Column({ name: 'unit_price', type: 'float' })
  unitPrice!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'float', default: 0 })
  tax!: number;

  @Column({ type: 'float' })
  amount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Invoice, (inv) => inv.invoiceDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice!: Invoice;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_code', referencedColumnName: 'itemCode' })
  item!: Item;
}
