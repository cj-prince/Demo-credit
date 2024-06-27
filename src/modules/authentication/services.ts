// import authRepository from './repositories';
// import * as authParams from './entities';
// import { ConflictException, NotFoundException, UnAuthorizedException } from '../../shared/lib/errors';

export interface AuthenticationServiceInterface {}

export class AuthenticationServiceImpl
  implements AuthenticationServiceInterface
{
  constructor() {}
}

const AuthenticationServices = new AuthenticationServiceImpl();

export default AuthenticationServices;
