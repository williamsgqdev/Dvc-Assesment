import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/model';

@ObjectType()
export class AuthResponseData {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class AuthResponse {
  @Field()
  message: string;

  @Field(() => AuthResponseData)
  data: AuthResponseData;
}
