import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class StockJournal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mutationType: string;

  @Column()
  quantity: number;

  @Column()
  inventoryId: string;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  destinationInventoryId: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.stockJournals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'destinationInventoryId' })
  destinationInventory: Inventory;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
