export interface CreatePostRequest {
  content: string;
}

export interface CreatePostResponse {
  id: string;
  content: string;
  timestamp: string;
  username: string;
  avatar: string;
}
