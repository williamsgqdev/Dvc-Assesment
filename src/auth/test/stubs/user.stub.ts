import { User } from 'src/users/model';

export const userStub = (): User => {
  return {
    id: 'random-uuid',
    email: 'random@mail.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
