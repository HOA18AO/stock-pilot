import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { PurchaseDetail } from './purchase-detail.entity';
import { PURCHASE_STATUS, PURCHASE_STATUS_LIST } from '../common/constants/purchase_statuses';
import { PURCHASE_TYPES, PURCHASE_TYPES_LIST } from '../common/constants/purchase_types';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('purchase')
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ type: 'enum', enum: PURCHASE_TYPES, default: PURCHASE_TYPES.PURCHASE }) // purchasing, returning
  type!: PURCHASE_TYPES_LIST;

  @Column({ name: 'vendor_code', type: 'varchar' })
  vendorCode!: string;

  @Column({ name: 'original_amount', type: 'float', default: 0 })
  originalAmount!: number;

  @Column({ name: 'additional_fee', type: 'float', default: 0 })
  additionalFee!: number;

  @Column({ type: 'float', default: 0 })
  tax!: number;

  @Column({ name: 'final_amount', type: 'float', default: 0 })
  finalAmount!: number;

  @Column({ type: 'enum', enum: PURCHASE_STATUS, default: PURCHASE_STATUS.PENDING }) // draft, pending, processing, completed
  status!: PURCHASE_STATUS_LIST;

  @Column({ type: 'text', nullable: true, name: 'note' })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Vendor, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vendor_code', referencedColumnName: 'code' })
  vendor!: Vendor;

  @OneToMany(() => PurchaseDetail, (d) => d.purchase)
  purchaseDetails!: PurchaseDetail[];
}
