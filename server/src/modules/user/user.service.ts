import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findOne({
      where: [{ username: dto.username }, { code: dto.code }],
    });
    if (existing) {
      throw new ConflictException('Username or code already exists');
    }
    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const entity = this.repo.create({
      ...dto,
      password: hashed,
      active: dto.active ?? true,
    });
    const saved = await this.repo.save(entity);
    return this.omitPassword(saved);
  }

  async findAll() {
    const list = await this.repo.find({
      order: { id: 'ASC' },
      select: ['id', 'name', 'code', 'mobile', 'username', 'role', 'active'],
    });
    return list;
  }

  async findOne(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('User #' + id + ' not found');
    return this.omitPassword(entity);
  }

  async update(id: number, dto: UpdateUserDto) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('User #' + id + ' not found');
    if (dto.username && dto.username !== entity.username) {
      const existing = await this.repo.findOne({
        where: { username: dto.username },
      });
      if (existing) throw new ConflictException('Username already exists');
    }
    if (dto.code && dto.code !== entity.code) {
      const existing = await this.repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException('Code already exists');
    }
    if (dto.password) {
      (dto as CreateUserDto).password = await bcrypt.hash(
        dto.password,
        SALT_ROUNDS,
      );
    }
    Object.assign(entity, dto);
    const saved = await this.repo.save(entity);
    return this.omitPassword(saved);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('User #' + id + ' not found');
    await this.repo.remove(entity);
    return this.omitPassword(entity);
  }

  private omitPassword(user: User): Omit<User, 'password'> {
    const { password, ...rest } = user;
    return rest;
  }
}
