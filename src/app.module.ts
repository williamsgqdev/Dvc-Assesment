import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
