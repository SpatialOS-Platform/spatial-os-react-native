import { useState, useCallback } from 'react';
import { useSpatialOS } from '../SpatialOSProvider';
import type { User, AuthResult } from '../types/user';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

/**
 * Hook for authentication operations
 * 
 * @example
 * ```tsx
 * const { login, logout, user, isLoading } = useAuth();
 * 
 * const handleLogin = async () => {
 *   const result = await login('user@example.com', 'password');
 * };
 * ```
 */
export function useAuth() {
    const client = useSpatialOS();
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: client.isAuthenticated(),
    });

    const login = useCallback(async (email: string, password: string): Promise<AuthResult | null> => {
        setState((s: AuthState) => ({ ...s, isLoading: true, error: null }));
        try {
            const result = await client.login(email, password);
            const user = await client.me();
            setState({ user, isLoading: false, error: null, isAuthenticated: true });
            return result;
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Login failed';
            setState((s: AuthState) => ({ ...s, isLoading: false, error, isAuthenticated: false }));
            return null;
        }
    }, [client]);

    const register = useCallback(async (
        email: string,
        password: string,
        displayName?: string
    ): Promise<AuthResult | null> => {
        setState((s: AuthState) => ({ ...s, isLoading: true, error: null }));
        try {
            const result = await client.register(email, password, displayName);
            setState((s: AuthState) => ({ ...s, isLoading: false }));
            return result;
        } catch (e) {
            const error = e instanceof Error ? e.message : 'Registration failed';
            setState((s: AuthState) => ({ ...s, isLoading: false, error }));
            return null;
        }
    }, [client]);

    const logout = useCallback(async () => {
        await client.logout();
        setState({ user: null, isLoading: false, error: null, isAuthenticated: false });
    }, [client]);

    const refreshUser = useCallback(async () => {
        if (!client.isAuthenticated()) return;
        try {
            const user = await client.me();
            setState((s: AuthState) => ({ ...s, user }));
        } catch {
            // Token may be expired
            setState((s: AuthState) => ({ ...s, user: null, isAuthenticated: false }));
        }
    }, [client]);

    return {
        ...state,
        login,
        register,
        logout,
        refreshUser,
    };
}
