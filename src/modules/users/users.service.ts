import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserView } from './views/user.view';
import { SinginDto } from './dto/sing-in.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersRepository.findOne({ where: { username: createUserDto.username } });
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = this.usersRepository.create({
      fullName: createUserDto.fullName,
      username: createUserDto.username,
      password: hash,
    });

    const savedUser = await this.usersRepository.save(newUser);

    return this.setUserToken(savedUser);
  }

  async hashData(data: string) {
    return argon2.hash(data);
  }

  async setUserToken(user: User) {
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      tokens,
      user: new UserView(user).render(),
    };
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.accessSecret'),
          expiresIn: this.configService.get('jwt.accessTokenExpireAfter'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async signIn({ password, username }: SinginDto) {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(user.id, username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens,
      user: new UserView(user).render(),
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.findOneById(userId);
    if (!user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
  }
}
