/**
 * User types for Spatial OS
 */

export interface User {
    principal_id: string;
    email?: string;
    display_name?: string;
    username?: string;
    role?: string;
    avatar_url?: string;
    created_at?: string;
}

export interface AuthResult {
    token?: string;
    role?: string;
    user?: User;
    message?: string;
    principal_id?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    display_name?: string;
}
