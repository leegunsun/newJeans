import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { CardPosts } from './CardPosts';

@Entity({ name: 'Prefers' })
export class Prefers {
  @PrimaryGeneratedColumn('uuid')
  preferIdx: string;

  @Column({ type: 'uuid', nullable: false })
  userIdx: string;

  @Column({ type: 'uuid', nullable: false })
  postIdx: string;

  @Column({ type: 'varchar', nullable: false })
  selectprefer: string; // 1. 디폴트 값이 존재해야함 2. 어떤식으로 저장할지 정해햐함

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  Prefers | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.Prefers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  Prefers | M : 1 | CardPosts
  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.Prefers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;
}
