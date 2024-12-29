import { Address } from './address.entity';
import { Role } from './role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @OneToMany(() => Address, (address: Address) => address.user)
  @JoinTable({ name: 'user_address' })
  addresses: Address[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
