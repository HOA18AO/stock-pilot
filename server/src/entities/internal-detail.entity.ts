import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Internal } from './internal.entity';
import { Item } from './item.entity';
import { InternalFulfillment } from './internal-fulfillment.entity';

@Entity('internal_detail')
export class InternalDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'internal_id', type: 'int' })
  internalId!: number;

  @Column({ name: 'item_code', type: 'varchar' })
  itemCode!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @ManyToOne(() => Internal, (internal) => internal.internalDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'internal_id' })
  internal!: Internal;

  @ManyToOne(() => Item, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_code', referencedColumnName: 'itemCode' })
  item!: Item;

  @OneToMany(() => InternalFulfillment, (f) => f.internalDetail)
  internalFulfillments!: InternalFulfillment[];
}
