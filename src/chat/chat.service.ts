import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from 'src/entities/Chats.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import {
  EnterUserChatDto,
  CreateUserChatDto,
  CreateChatSaveDto,
} from './dto/chat.dto';
import { Users } from 'src/entities/Users.entity';
import { UUID } from 'crypto';
import { ChatSaves } from 'src/entities/ChatSaves.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    private chatRepository: Repository<Chats>,
    @InjectRepository(ChatSaves)
    private chatSavesRepository: Repository<ChatSaves>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  /**
   * 1. 채팅방을 조회합니다 페이지 네이션으로 작동합니다.
   * @param enterUserChatDto
   * @returns
   */
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

  /**
   * 2. 채팅방 생성
   * @param userIdx
   * @param createUserChatDto
   * @returns
   */
  async createUserChat(
    userIdx: UUID,
    createUserChatDto: CreateUserChatDto,
  ): Promise<Chats> {
    const { maxParty, roomName } = createUserChatDto;

    const createChat: Chats = await this.chatRepository.save({
      userIdx,
      maxParty,
      roomName,
    });

    return createChat;
  }

  /**
   * 3. 채팅방 삭제
   * @param userIdx
   * @param deleteUserChatDto
   * @returns
   */
  async deleteUserChat(userIdx: UUID, roomName: string): Promise<void> {
    const exesitChat: Chats = await this.chatRepository.findOne({
      where: { roomName },
    });

    if (!exesitChat) {
      throw new BadRequestException('해당 채팅이 존재하지 않습니다.');
    }
    if (exesitChat.userIdx !== userIdx) {
      throw new BadRequestException('해당 게시글 삭제 권한이 없습니다.');
    }

    await this.chatRepository
      .createQueryBuilder()
      .delete()
      .from(Chats)
      .where('roomName = :roomName AND userIdx = :userIdx', {
        roomName,
        userIdx,
      })
      .execute();

    return;
  }

  /**
   * 4. 채팅방을 생성한 admin 조회
   * @param roomName
   * @returns
   */
  async adminUserFind(roomName: string): Promise<Chats> {
    const existChat: Chats = await this.chatRepository.findOne({
      where: { roomName },
    });

    if (!existChat) {
      throw new BadRequestException(
        `${roomName} 해당 채팅방이 존재하지 않습니다.`,
      );
    }

    const findAdmin: Chats = await this.chatRepository
      .createQueryBuilder('c')
      .where('c.roomName = :roomName', { roomName })
      .select(['u.nickname as nickname'])
      .leftJoin(Users, 'u', 'c.userIdx = u.userIdx')
      .getRawOne();

    return findAdmin;
  }

  /**
   * 5. chatSaveIdx를 이용해 채팅 내역을 가져옵니다.
   * @param chatSaveIdx
   * @returns
   */
  async findChatSave(chatSaveIdx: UUID): Promise<ChatSaves> {
    const findChat: ChatSaves = await this.chatSavesRepository.findOne({
      where: { chatSaveIdx },
      select: { saveData: true },
    });

    return findChat;
  }

  /**
   * 6. 채팅 내역을 저장합니다.
   * @param createChatSaveDto
   * @returns
   */
  async chatSave(createChatSaveDto: CreateChatSaveDto): Promise<void> {
    const { nickname, room, saveData } = createChatSaveDto;
    try {
      await this.chatSavesRepository.save({ nickname, room, saveData });
    } catch (error) {
      throw new BadRequestException('채팅 저장에 실패했습니다.');
    }

    return;
  }

  /**
   * 7. 삭제된 채팅방의 이름과 chatSaveIdx를 모두 가져옵니다.
   * @returns
   */
  async doneChat(): Promise<object[]> {
    // const doneChat: object[] = await this.chatSavesRepository
    //   .createQueryBuilder()
    //   .select(['chatSaveIdx', 'room'])
    //   .getMany();

    const doneChat = await this.chatSavesRepository
      .createQueryBuilder()
      .from(ChatSaves, 'cs')
      .select(['cs.chatSaveIdx', 'cs.room'])
      .getMany();

    return doneChat;
  }
}
