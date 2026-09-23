import { API_BASE_URL, TOKEN_KEY } from './config';
import type { ErrorResponse } from '../types';

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData — browser sets boundary automatically
  if (!(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    if (onUnauthorized) onUnauthorized();
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  // 204 No Content or empty body
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      const err = data as ErrorResponse;
      throw new ApiError(err.status ?? res.status, err.message ?? 'Something went wrong');
    }
    return data as T;
  }

  // Plain text response (e.g. JWT token from /login)
  const text = await res.text();
  if (!res.ok) {
    throw new ApiError(res.status, text || 'Something went wrong');
  }
  return text as unknown as T;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── Auth API ──────────────────────────────────────────────

export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    request<string>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<string>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () =>
    request<import('../types').UserResponseDTO>('/user', { method: 'GET' }),

  updateUsername: (username: string) =>
    request<void>('/user/username', {
      method: 'PATCH',
      body: JSON.stringify(username),
    }),

  updateDescription: (description: string) =>
    request<void>('/user/description', {
      method: 'PATCH',
      body: JSON.stringify(description),
    }),

  deleteUser: () =>
    request<void>('/user', { method: 'DELETE' }),
};

// ─── Blog API ──────────────────────────────────────────────

export const blogApi = {
  getAll: () =>
    request<import('../types').BlogResponseDTO[]>('/blog', { method: 'GET' }),

  getById: (id: string) =>
    request<import('../types').DetailedBlogResponseDTO>(`/blog/id/${id}`, { method: 'GET' }),

  getByUsername: (username: string) =>
    request<import('../types').BlogResponseDTO[]>(`/blog/username/${encodeURIComponent(username)}`, {
      method: 'GET',
    }),

  getMyBlogs: () =>
    request<import('../types').BlogResponseDTO[]>('/blog/my', { method: 'GET' }),

  create: (data: { title: string; content: string; image: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('image', data.image);
    return request<void>('/blog', { method: 'POST', body: formData });
  },

  update: (id: string, data: { title: string; content: string; image: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('image', data.image);
    return request<void>(`/blog/${id}`, { method: 'PUT', body: formData });
  },

  delete: (id: string) =>
    request<void>(`/blog/${id}`, { method: 'DELETE' }),

  updateTitle: (id: string, title: string) =>
    request<void>(`/blog/title/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(title),
    }),

  updateContent: (id: string, content: string) =>
    request<void>(`/blog/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(content),
    }),

  updateImage: (id: string, image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return request<void>(`/blog/image/${id}`, {
      method: 'PATCH',
      body: formData,
    });
  },
};
