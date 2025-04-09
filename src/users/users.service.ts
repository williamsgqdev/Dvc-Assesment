import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findUserByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async createUser(payload: Prisma.UserCreateInput) {
    const user = await this.databaseService.user.create({
      data: {
        ...payload,
      },
    });
    return user;
  }
  async findUserByBiometricKey(biometricKey: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        biometricKey,
      },
    });
    return user;
  }
}
