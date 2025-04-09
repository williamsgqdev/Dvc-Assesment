import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthResponse } from './model';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs';
import { CustomResponse } from 'src/common';
import { SignInArgs, SigninWithBiometricsArgs } from './dto/args';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => CustomResponse)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Query(() => AuthResponse)
  async singin(@Args() signInArgs: SignInArgs) {
    return this.authService.signin(signInArgs);
  }

  @Query(() => AuthResponse)
  async signinWithBiometric(
    @Args() signinWithBiometricsArgs: SigninWithBiometricsArgs,
  ) {
    return this.authService.signinWithBiometric(signinWithBiometricsArgs);
  }
}
