// Types matching the OpenAPI spec exactly — do not invent fields

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BlogRequestDTO {
  title: string;
  content: string;
  image: File;
}

// Lightweight blog used in lists
export interface BlogResponseDTO {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

// Full blog with content + canDelete flag
export interface DetailedBlogResponseDTO {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  author: string;
  createdAt: string;
  canDelete: boolean;
}

export interface UserResponseDTO {
  email: string;
  username: string;
  blogs: BlogResponseDTO[];
  createdAt: string;
  description?: string;
}
