import { type MeResponse, type UserResponse } from '../types';

export const mockMeResponse: MeResponse = {
  userId: 'user-123',
};

export const mockUserResponse: UserResponse = {
  id: 'user-123',
  userName: 'johndoe',
  profileDescription: 'Software engineer passionate about building great products.',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
};

export const mockUnauthenticatedUser: UserResponse = {
  id: 'guest',
  userName: 'guest',
  profileDescription: 'Not logged in',
  avatarUrl: undefined,
};