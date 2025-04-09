import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthResponse } from './model';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs';
import { CustomResponse } from 'src/common';
import { SignInArgs, SigninWithBiometricsArgs } from './dto/args';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAuthToken } from './interfaces';
import { User } from 'src/users/model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards';

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

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  whoAmi(@CurrentUser() currentUser: IAuthToken) {
    return this.authService.whoAmi(currentUser);
  }
}
