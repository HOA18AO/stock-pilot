import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InternalDetail } from './internal-detail.entity';
import { Inventory } from './inventory.entity';

@Entity('internal_fulfillment')
export class InternalFulfillment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'internal_detail_id', type: 'int' })
  internalDetailId!: number;

  @Column({ name: 'internal_code', type: 'varchar' })
  internalCode!: string;

  @Column({ name: 'serial_code', type: 'varchar' })
  serialCode!: string;

  @Column({ type: 'int' }) // 1 or -1
  quantity!: number;

  @ManyToOne(() => InternalDetail, (detail) => detail.internalFulfillments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'internal_detail_id' })
  internalDetail!: InternalDetail;

  @ManyToOne(() => Inventory, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serial_code', referencedColumnName: 'serialCode' })
  inventory!: Inventory;
}
