import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from 'src/entities/Chats.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import {
  EnterUserChatDto,
  CreateUserChatDto,
  DeleteUserChatDto,
} from './dto/chat.dto';
import { Users } from 'src/entities/Users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    private chatRepository: Repository<Chats>,
  ) {}

  async chatRooms(enterUserChatDto: EnterUserChatDto): Promise<object[]> {
    const { splitNumber, splitPageNumber } = enterUserChatDto;

    const qb: SelectQueryBuilder<object> = await this.chatRepository
      .createQueryBuilder('c')
      .orderBy('c.createdAt', 'DESC')
      .offset(splitNumber * (splitPageNumber - 1))
      .limit(splitNumber)
      .leftJoin(Users, 'u', 'c.userIdx = u.userIdx')
      .select(['c.chatIdx', 'c.roomName', 'c.maxParty', 'u.nickname']);

    return qb.getRawMany();
  }

  async createUserChat(createUserChatDto: CreateUserChatDto): Promise<Chats> {
    const { maxParty, roomName } = createUserChatDto;

    const createChat: Chats = await this.chatRepository.create({
      maxParty,
      roomName,
    });

    return createChat;
  }

  async deleteUserChat(deleteUserChatDto: DeleteUserChatDto): Promise<void> {
    const { roomName } = deleteUserChatDto;

    const exesitChat: Chats = await this.chatRepository.findOne({
      where: { roomName },
    });

    if (!exesitChat) {
      throw new BadRequestException('해당 채팅이 존재하지 않습니다.');
    }

    const deleteChat: DeleteResult = await this.chatRepository
      .createQueryBuilder('c')
      .delete()
      .from(Chats)
      .where('c.roomName = :roomName', { roomName })
      .andWhere('') // 유저 조건 추가해야함
      .execute();

    deleteChat;
    return;
  }
}
