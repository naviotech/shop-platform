export interface User {
  id:       string;
  email:    string;
  fullName: string;
  isActive: boolean;
  roles:    string[];
}

export enum AuthStatus {
  CHECKING = 'checking',
  AUTHENTICATED = 'authenticated',
  NOTAUTHENTICATED = 'not-authenticated',
}
export interface LoginProps{
  email: string,
  password: string
}
export interface RegisterProps extends LoginProps{
  username: string
}
