import { ConfigService } from '@nestjs/config';

export type MockConfigService = Partial<Record<keyof ConfigService, jest.Mock>>;
export const mockConfigService = (): MockConfigService => ({
  get: jest.fn(),
});
