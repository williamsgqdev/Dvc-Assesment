import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { mockJwtService, MockJwtService } from './mocks/jwt-service.mock';
import {
  mockConfigService,
  MockConfigService,
} from './mocks/config-service.mock';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MockUserService, mockUsersService } from './mocks/users-service.mock';
import { userStub } from './stubs/user.stub';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: MockJwtService;
  let configService: MockConfigService;
  let usersService: MockUserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<MockJwtService>(JwtService);
    configService = module.get<MockConfigService>(ConfigService);
    usersService = module.get<MockUserService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    describe('when signup is successful', () => {
      it('should return success message', async () => {
        const expectedUser = userStub();
        usersService.findUserByEmail?.mockResolvedValue(null);
        usersService.findUserByBiometricKey?.mockResolvedValue(null);
        usersService.createUser?.mockResolvedValue(expectedUser);
        configService.get?.mockReturnValue('some-random-salt');
        const result = await service.signup({
          email: expectedUser.email,
          password: 'password',
          biometricKey: 'biometricKey',
        });
        expect(result).toEqual({
          message: 'Account created successfully',
        });
        expect(usersService.findUserByEmail).toHaveBeenCalled();
        expect(usersService.findUserByBiometricKey).toHaveBeenCalled();
        expect(usersService.createUser).toHaveBeenCalled();
        expect(configService.get).toHaveBeenCalled();
      });
    });
    describe('otherwise', () => {
      describe('duplicate email', () => {
        it('should throw "UnprocessableEntityException"', async () => {
          usersService.findUserByEmail?.mockResolvedValue(userStub());
          try {
            await service.signup({
              email: userStub().email,
              password: 'password',
              biometricKey: 'biometricKey',
            });
          } catch (error) {
            expect(error).toBeInstanceOf(UnprocessableEntityException);
          }
        });
      });
      describe('duplicate biometric key', () => {
        it('should throw "UnprocessableEntityException"', async () => {
          usersService.findUserByEmail?.mockResolvedValue(null);
          configService.get?.mockReturnValue('random-secret');
          usersService.findUserByBiometricKey?.mockResolvedValue(
            'hahsedString',
          );
          try {
            await service.signup({
              email: userStub().email,
              password: 'password',
              biometricKey: 'biometricKey',
            });
          } catch (error) {
            expect(error).toBeInstanceOf(UnprocessableEntityException);
          }
        });
      });
    });
  });

  describe('signin', () => {
    describe('when signin is successful', () => {
      it('should return access token and user', async () => {
        const expectedUser = userStub();
        usersService.findUserByEmail?.mockResolvedValue(expectedUser);
        configService.get?.mockReturnValue('random-secret');
        const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
        jwtService.sign?.mockReturnValue('access-token');
        const result = await service.signin({
          email: expectedUser.email,
          password: 'password',
        });
        expect(result).toEqual({
          message: 'Login successful',
          data: {
            accessToken: 'access-token',
            user: expectedUser,
          },
        });
        expect(usersService.findUserByEmail).toHaveBeenCalled();
        expect(configService.get).toHaveBeenCalled();
        expect(verifySpy).toHaveBeenCalled();
        expect(jwtService.sign).toHaveBeenCalled();
      });
    });
    describe('otherwise', () => {
      describe('user does not exist', () => {
        it('should throw "UnauthorizedException"', async () => {
          usersService.findUserByEmail?.mockResolvedValue(null);
          try {
            await service.signin({
              email: userStub().email,
              password: 'password',
            });
          } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
          }
        });
      });

      describe('invalid password', () => {
        it('should throw "UnauthorizedException"', async () => {
          usersService.findUserByEmail?.mockResolvedValue(userStub());
          const verifySpy = jest
            .spyOn(argon2, 'verify')
            .mockResolvedValue(false);
          try {
            await service.signin({
              email: userStub().email,
              password: 'password',
            });
          } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
            expect(verifySpy).toHaveBeenCalled();
          }
        });
      });
    });
  });

  describe('signinWithBiometric', () => {
    describe('when signin is successful', () => {
      it('should return access token and user', async () => {
        const expectedUser = userStub();
        usersService.findUserByBiometricKey?.mockResolvedValue(expectedUser);
        configService.get?.mockReturnValue('random-secret');
        const verifySpy = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
        jwtService.sign?.mockReturnValue('access-token');
        const result = await service.signinWithBiometric({
          biometricKey: 'biometricKey',
        });
        expect(result).toEqual({
          message: 'Login successful',
          data: {
            accessToken: 'access-token',
            user: expectedUser,
          },
        });
        expect(usersService.findUserByBiometricKey).toHaveBeenCalled();
        expect(configService.get).toHaveBeenCalled();
        expect(verifySpy).toHaveBeenCalled();
        expect(jwtService.sign).toHaveBeenCalled();
      });
    });
    describe('otherwise', () => {
      describe('user does not exist', () => {
        it('should throw "UnauthorizedException"', async () => {
          configService.get?.mockReturnValue('saved-secret');
          usersService.findUserByBiometricKey?.mockResolvedValue(null);
          try {
            await service.signinWithBiometric({
              biometricKey: 'biometricKey',
            });
          } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
          }
        });
      });
    });
  });
});
