import { type MeResponse, type UserResponse, type LoginPayload, type RegisterPayload } from '../types';

const apiUrl = import.meta.env.PUBLIC_AUTH_API;

if (!apiUrl) {
  throw new Error('PUBLIC_AUTH_API environment variable is not configured');
}

export const fetchMe = async (): Promise<MeResponse> => {
  const response = await fetch(`${apiUrl}/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized');
    }
    throw new Error(`Failed to fetch auth status: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchUser = async (): Promise<UserResponse> => {
  const response = await fetch(`${apiUrl}/user`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
};

export const register = async (data: RegisterPayload): Promise<UserResponse> => {
  const response = await fetch(`${apiUrl}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to register: ${response.statusText}`);
  }

  return response.json();
};

export const login = async (data: LoginPayload): Promise<UserResponse> => {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to login: ${response.statusText}`);
  }

  return response.json();
};
