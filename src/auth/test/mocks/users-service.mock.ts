import { UsersService } from 'src/users/users.service';

export type MockUserService = Partial<Record<keyof UsersService, jest.Mock>>;
export const mockUsersService: MockUserService = {
  findUserByEmail: jest.fn(),
  findUserByBiometricKey: jest.fn(),
  createUser: jest.fn(),
};
