import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { InternalDetail } from './internal-detail.entity';
import { INTERNAL_TYPES, InternalType } from '../common/constants/internal_types';
import { INTERNAL_STATUSES, InternalStatus } from '../common/constants/internal_statuses';

@Entity('internal')
export class Internal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ name: 'from_warehouse', type: 'varchar' })
  fromWarehouse!: string;

  @Column({ name: 'to_warehouse', type: 'varchar' })
  toWarehouse!: string;

  @Column({ type: 'enum', enum: INTERNAL_TYPES })
  type!: InternalType;

  @Column({ type: 'enum', enum: INTERNAL_STATUSES, default: INTERNAL_STATUSES.PENDING })
  status!: InternalStatus;

  @Column({ type: 'text', nullable: true, name: 'note' })
  description!: string | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_warehouse', referencedColumnName: 'code' })
  fromWarehouseRef!: Warehouse;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_warehouse', referencedColumnName: 'code' })
  toWarehouseRef!: Warehouse;

  @OneToMany(() => InternalDetail, (detail) => detail.internal)
  internalDetails!: InternalDetail[];
}
