import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminWarehouse } from './admin-warehouse.entity';
import { Inventory } from './inventory.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'double precision', default: 0 })
  lat: number;

  @Column({ type: 'double precision', default: 0 })
  lng: number;

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  inventories: Inventory[];

  @OneToMany(
    () => AdminWarehouse,
    (adminWarehouse) => adminWarehouse.warehouse,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  adminWarehouses: AdminWarehouse[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
