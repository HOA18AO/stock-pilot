import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InvoiceDetail } from './invoice-detail.entity';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ name: 'original_amount', type: 'float' })
  originalAmount!: number;

  @Column({ type: 'float' }) // amount
  tax!: number;

  @Column({ name: 'final_amount', type: 'float' })
  finalAmount!: number;

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

  @OneToMany(() => InvoiceDetail, (d) => d.invoice)
  invoiceDetails!: InvoiceDetail[];
}
