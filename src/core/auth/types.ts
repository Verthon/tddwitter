export type AuthorizationStatus = 'pending' | 'error' | 'authenticated' | 'unauthenticated';

export interface User {
  userName: string;
  profileDescription: string;
  avatarUrl?: string;
}

export interface MeResponse {
  userId: string;
}

export interface UserResponse extends User {
  id: string;
}