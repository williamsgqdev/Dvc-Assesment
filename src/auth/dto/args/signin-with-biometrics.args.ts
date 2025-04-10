import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class SigninWithBiometricsArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  biometricKey: string;
}
