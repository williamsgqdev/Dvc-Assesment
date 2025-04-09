import { JwtService } from '@nestjs/jwt';

export type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;
export const mockJwtService = (): MockJwtService => ({
  sign: jest.fn(),
});
