import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseDetail } from './purchase-detail.entity';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('purchase_receipt')
export class PurchaseReceipt {
  @PrimaryGeneratedColumn()
  id!: number;  

  @Column({ name: 'purchase_code', type: 'varchar' })
  purchaseCode!: string;

  @Column({ name: 'purchase_detail_id', type: 'int' })
  purchaseDetailId!: number; 

  @Column({ name: 'serial_code', type: 'varchar' })
  serialCode!: string;

  @Column({ type: 'int' }) // 1 or -1
  quantity!: number;

  @ManyToOne(() => PurchaseDetail, (d) => d.purchaseReceipts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_detail_id' })
  purchaseDetail!: PurchaseDetail;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;  

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date; 
}
