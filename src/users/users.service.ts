import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import { SignupReqeustDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    ){}

    async findByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email: email } });
      }

    async signup(data: SignupReqeustDto) : Promise<Users>{
        const email = await this.usersRepository.findOne({
            where: { email: data.email },
          });
        
        if(email)
        throw new ConflictException('이미 존재하는 이메일 입니다.');

        const nickname = await this.usersRepository.findOne({
            where: { nickname: data.nickname },
          });

        if(nickname)
        throw new ConflictException('이미 존재하는 닉네임 입니다.');
        
        const hashedPassword =
        data.provider === 'local' ? await bcrypt.hash(data.password, 12) : null;
        
        const nicknameOrEmail = data.nickname
        ? data.nickname
        : data.email
        ? data.email
        : false;

        if (!nicknameOrEmail)
        throw new BadRequestException('올바르지 않은 데이터 형식입니다.');

        const nicknameRegexp = /^[a-zA-Z0-9]{3,10}$/g;
        const emailRegexp =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        const isCorrect = nicknameRegexp.test(nicknameOrEmail)
        ? { nickname: nicknameOrEmail }
        : emailRegexp.test(nicknameOrEmail)
        ? { email: nicknameOrEmail }
        : false;

        if (!isCorrect)
        throw new BadRequestException('올바르지 않은 데이터 형식입니다.');
        
        const insertedUser = await this.usersRepository.create({
            email: data.email,
            nickname: data.nickname,
            password: hashedPassword
          });

        await this.usersRepository.save(insertedUser);
        return insertedUser;
    }
    
}
