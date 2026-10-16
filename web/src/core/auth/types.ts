export type AuthorizationStatus =
  | 'pending'
  | 'error'
  | 'authenticated'
  | 'unauthenticated';

export interface User {
  userName: string;
  profileDescription: string;
  avatarUrl?: string;
}

export interface MeResponse {
  id: number;
  email: string;
}

export type LoginResponse = MeResponse;

export interface UserResponse extends User {
  id: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
