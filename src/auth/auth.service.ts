import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupInput } from './dto/inputs';
import { CustomResponse } from 'src/common';
import * as argon2 from 'argon2';
import { SignInArgs, SigninWithBiometricsArgs } from './dto/args';
import { JwtService } from '@nestjs/jwt';
import { IAuthToken } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from './model';
import { User } from 'src/users/model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signup(signupInput: SignupInput): Promise<CustomResponse> {
    const duplicateCheck = await this.usersService.findUserByEmail(
      signupInput.email,
    );
    if (duplicateCheck)
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );

    if (signupInput?.biometricKey) {
      const duplicateBiometricCheck =
        await this.usersService.findUserByBiometricKey(
          await this.hashBiometricKey(signupInput.biometricKey),
        );
      if (duplicateBiometricCheck)
        throw new UnprocessableEntityException(
          'Biometric key already in use by another user',
        );
    }

    await this.usersService.createUser({
      email: signupInput.email,
      password: await argon2.hash(signupInput.password),
      ...(signupInput?.biometricKey && {
        biometricKey: await this.hashBiometricKey(signupInput.biometricKey),
      }),
    });
    return {
      message: 'Account created successfully',
    };
  }

  async signin(signInArgs: SignInArgs): Promise<AuthResponse> {
    const user = await this.usersService.findUserByEmail(signInArgs.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const passwordValid = await argon2.verify(
      user.password,
      signInArgs.password,
    );
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');
    const payload: IAuthToken = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
    return {
      message: 'Login successful',
      data: {
        accessToken,
        user,
      },
    };
  }

  async signinWithBiometric(
    signinWithBiometricsArgs: SigninWithBiometricsArgs,
  ) {
    const hashedBiometricKey = await this.hashBiometricKey(
      signinWithBiometricsArgs.biometricKey,
    );

    const user =
      await this.usersService.findUserByBiometricKey(hashedBiometricKey);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: IAuthToken = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
    return {
      message: 'Login successful',
      data: {
        accessToken,
        user,
      },
    };
  }

  private async hashBiometricKey(biometricKey: string) {
    const secret = Buffer.from(
      this.configService.get<string>('BIOMETRIC_SECRET') as unknown as string,
    );
    const salt = Buffer.from(
      this.configService.get<string>('BIOMETRIC_SALT') as unknown as string,
    );
    const hash = await argon2.hash(biometricKey, {
      secret,
      salt,
      timeCost: 3,
      memoryCost: 4096,
      parallelism: 1,
      type: argon2.argon2id,
      hashLength: 32,
    });
    return hash;
  }

  async whoAmi(currentUser: IAuthToken): Promise<User> {
    const userData = await this.usersService.findUserByEmail(currentUser.email);
    if (!userData) throw new NotFoundException('Invalid credentials');
    return userData;
  }
}
