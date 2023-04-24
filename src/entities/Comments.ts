// import {
//     Column,
//     CreateDateColumn,
//     DeleteDateColumn,
//     Entity,
//     JoinColumn,
//     ManyToOne,
//     OneToMany,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
//   } from 'typeorm';
//   import { CommentLikes } from './CommentsLikes';
//   import { Posts } from './Posts';
//   import { Users } from './Users';

//   @Entity({ name: 'comments' })
//   export class Comments {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({ type: 'int' })
//     target: number | null;

//     @Column({ type: 'text' })
//     comment: string;

//     @CreateDateColumn({ type: 'timestamp' })
//     createdAt: Date;

//     @UpdateDateColumn({ type: 'timestamp' })
//     updatedAt: Date;

//     @DeleteDateColumn({ type: 'timestamp' })
//     deletedAt: Date | null;

//     // * Foreign Key * /

//     @Column({ type: 'int' })
//     UserId: number;

//     @Column({ type: 'int' })
//     PostId: number;
//     // * Relation * /

//     // *  Users | 1 : M | CommentsLikes
//     @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.Comment)
//     CommentLikes: CommentLikes[];

//     // *  PostLikes | M : 1 | Users
//     @ManyToOne(() => Users, (users) => users.Comments, { onDelete: 'CASCADE' })
//     @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
//     User: Users;

//     // *  PostLikes | M : 1 | Posts
//     @ManyToOne(() => Posts, (posts) => posts.Comments, { onDelete: 'CASCADE' })
//     @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
//     Post: Posts;
//   }
