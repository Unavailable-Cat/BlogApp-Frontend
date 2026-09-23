export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const GOOGLE_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;
export const TOKEN_KEY = 'blog_auth_token';
export const USER_KEY = 'blog_user_cache';

// Google OAuth redirect — adjust this to match your backend's configured redirect URI
export const OAUTH_REDIRECT_KEY = 'oauth_redirect';
