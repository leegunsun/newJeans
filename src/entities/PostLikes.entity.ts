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
import { Users } from './Users.entity';
import { CardPosts } from './CardPosts.entity';
import { UUID } from 'crypto';

@Entity({ name: 'PostLikes' })
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  postLikeIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  userIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  postIdx: UUID;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //   @Column({ type: 'int' })
  //   UserId: number;

  //   @Column({ type: 'int' })
  //   PostId: number;

  //   // * Relation * /

  // *  PostLikes | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.PostLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  PostLikes | M : 1 | CardPosts
  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.PostLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;
}
