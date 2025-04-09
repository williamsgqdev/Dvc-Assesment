import { Request } from 'express';
import { IAuthToken } from 'src/auth/interfaces';

export interface GraphQLContext {
  req: Request & { user?: IAuthToken };
  res: any;
}
