import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'code' })
  code!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ nullable: true, name: 'note', type: 'text' })
  description!: string | null;

  @CreateDateColumn({ name : 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name : 'updated_at' })
  updatedAt!: Date;
}
