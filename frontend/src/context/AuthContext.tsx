/**
 * AuthContext - Google OAuth Authentication
 * Provides authentication state and methods throughout the app
 */
import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import {
    type User,
    TOKEN_KEY,
    USER_KEY
} from '../utils/auth';

import { AuthContext } from './AuthContextDefinition';

const API_BASE = import.meta.env.VITE_API_URL || '';

/** Unique ID for the current browser session (regenerated on every page load). */
const SESSION_ID = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') 
    ? crypto.randomUUID() 
    : `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
const SESSION_START = Date.now();

/** Register a beforeunload handler to mark the session as ended.
 *  Uses fetch with keepalive:true — survives page unload AND supports
 *  Authorization headers (unlike sendBeacon which cannot). */
let _sessionEndHandler: (() => void) | null = null;
function registerSessionEnd(token: string): void {
    // Remove any previous handler (e.g. token refresh called callLoginEvent again)
    if (_sessionEndHandler) {
        window.removeEventListener('beforeunload', _sessionEndHandler);
    }
    _sessionEndHandler = () => {
        const duration_s = Math.round((Date.now() - SESSION_START) / 1000);
        // keepalive: true lets the browser complete the request even after unload
        fetch(`${API_BASE}/api/user/session-end`, {
            method:    'POST',
            keepalive: true,
            headers:   { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body:      JSON.stringify({ session_id: SESSION_ID, duration_s })
        });
        // No .catch() — after unload there's no context to handle it
    };
    window.addEventListener('beforeunload', _sessionEndHandler);
}

/** Fire-and-forget: log geo + create session row for the current app session. */
function callLoginEvent(token: string): void {
    fetch(`${API_BASE}/api/user/login-event`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            session_id: SESSION_ID,
            device:     navigator.userAgent.slice(0, 200)
        })
    }).catch(() => { /* silently ignore — non-critical */ });
    registerSessionEnd(token);
}

// Inner provider (needs to be inside GoogleOAuthProvider)
const AuthProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem(USER_KEY);
            const savedToken = localStorage.getItem(TOKEN_KEY);
            const tokenExpiry = localStorage.getItem('codenium_token_expiry');

            if (savedUser && savedToken) {
                // Check if token is expired (default 1 hour from Google)
                if (tokenExpiry && parseInt(tokenExpiry, 10) > Date.now()) {
                    setUser(JSON.parse(savedUser));
                    setAccessToken(savedToken);
                    callLoginEvent(savedToken);  // ← record geo on app load
                } else if (!tokenExpiry) {
                    // Legacy: no expiry stored, assume valid for now
                    setUser(JSON.parse(savedUser));
                    setAccessToken(savedToken);
                    callLoginEvent(savedToken);  // ← record geo on app load
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                    localStorage.removeItem('codenium_token_expiry');
                }
            }
        } catch (error) {
            console.error('Error restoring auth session:', error);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem('codenium_token_expiry');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const googleLogin = useGoogleLogin({
        flow: 'implicit',
        ux_mode: 'redirect',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: async (tokenResponse: any) => {
            console.log('Google login success, fetching user info...');
            try {
                // Get user info from Google
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await userInfoResponse.json();
                console.log('User info fetched:', userInfo.email);

                const userData: User = {
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    sub: userInfo.sub
                };

                // Store token and user (access tokens expire in 1 hour)
                localStorage.setItem(TOKEN_KEY, tokenResponse.access_token);
                localStorage.setItem(USER_KEY, JSON.stringify(userData));
                localStorage.setItem('codenium_token_expiry', String(Date.now() + 3600 * 1000));
                setUser(userData);
                setAccessToken(tokenResponse.access_token);
                callLoginEvent(tokenResponse.access_token);  // ← record geo on explicit login
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.error('Google login failed:', error);
            // Some versions of the library return details in the error object
            if (error?.error === 'popup_closed_by_user') {
                console.warn('Login popup was closed before completion.');
            }
        }
    } as any);

    const login = useCallback(() => {
        console.log('Login triggered...');
        
        // Check if google script is loaded (it might be blocked by ad-blockers)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).google?.accounts?.id && !(window as any).google?.accounts?.oauth2) {
            console.error('Google accounts script not found. It may be blocked by an ad-blocker or tracking protection.');
            alert('Google Sign-In script could not be loaded. Please disable your ad-blocker and refresh the page.');
        }

        try {
            googleLogin();
        } catch (err) {
            console.error('Failed to execute googleLogin:', err);
        }
    }, [googleLogin]);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('codenium_token_expiry');
        setUser(null);
        setAccessToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            accessToken,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Main provider with Google OAuth wrapper
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    
    console.log('AuthProvider initializing with Client ID:', clientId ? `${clientId.substring(0, 10)}...` : 'MISSING');

    if (!clientId) {
        console.warn('VITE_GOOGLE_CLIENT_ID is not set. Auth will be disabled.');
        // Provide a mock context when no client ID - show console error (toast not available here)
        return (
            <AuthContext.Provider value={{
                user: null,
                isAuthenticated: false,
                isLoading: false,
                accessToken: null,
                login: () => {
                    // Can't use toast here as we're outside the ToastProvider in this branch
                    // Use console.error instead - the AdminLogin component will handle UI feedback
                    console.error('Google OAuth is not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
                },
                logout: () => { }
            }}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProviderInner>{children}</AuthProviderInner>
        </GoogleOAuthProvider>
    );
};
