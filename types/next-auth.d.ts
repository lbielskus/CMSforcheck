import { IUser } from '../../types';

declare module 'next-auth' {
  interface Session {
    user: IUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
