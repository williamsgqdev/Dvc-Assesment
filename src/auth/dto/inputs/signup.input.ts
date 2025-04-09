import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol',
    },
  )
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  biometricKey?: string;
}
