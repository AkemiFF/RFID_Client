// auth.ts
import { refreshAdminToken, refreshToken } from "./api"; // Assurez-vous d'avoir une fonction refreshAdminToken dans votre API

interface AuthData {
    access: string;
    refresh: string;
    user_id: number;
    username: string;
    email: string;
    role: string;
    access_expires_at: number;
}

interface AdminAuthData {
    access: string;
    refresh: string;
    admin_id: number;
    username: string;
    email: string;
    role: string;
    access_expires_at: number;
}

// Fonctions pour l'authentification des utilisateurs normaux
export const saveAuthData = (responseData: any) => {
    const authData: AuthData = {
        access: responseData.access,
        refresh: responseData.refresh,
        user_id: responseData.user_id,
        username: responseData.username,
        email: responseData.email,
        role: responseData.role,
        access_expires_at: Date.now() + (parseInt(responseData.token_lifetime.access) * 1000)
    };

    localStorage.setItem('auth', JSON.stringify(authData));
};

export const getAccessToken = (): string | null => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).access : null;
};

export const getRefreshToken = (): string | null => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).refresh : null;
};

export const isAuthenticated = (): boolean => {
    if (typeof window === "undefined") return false;

    const auth = localStorage.getItem('auth');
    if (!auth) return false;

    const { access_expires_at } = JSON.parse(auth);
    return Date.now() < access_expires_at;
};
export const isAuthenticated2 = (): boolean => {
    const auth = localStorage.getItem('auth');
    if (!auth) return false;

    const { access_expires_at } = JSON.parse(auth);
    return Date.now() < access_expires_at;
};

export const getAuthHeader = async (): Promise<HeadersInit> => {
    let token: string | null;
    if (!isAuthenticated()) {
        token = await refreshToken();
    } else {
        token = getAccessToken();
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
export const getClientToken = async (): Promise<string | null> => {
    let token: string | null;
    if (!isAuthenticated()) {
        token = await refreshToken();
    } else {
        token = getAccessToken();
    }
    return token;
};
export const getAdminToken = async (): Promise<string | null> => {
    let token: string | null;
    if (!isAdminAuthenticated()) {
        token = await refreshAdminToken();
    } else {
        token = getAdminAccessToken();
    }
    return token;
};

export const getAuthHeaderFormData = async (): Promise<HeadersInit> => {
    let token: string | null;
    if (!isAuthenticated()) {
        token = await refreshToken();
    } else {
        token = getAccessToken();
    }
    return {
        'Authorization': `Bearer ${token}`,
    };
};

// Fonctions pour l'authentification des administrateurs
export const saveAdminAuthData = (responseData: any) => {
    const adminAuthData: AdminAuthData = {
        access: responseData.access,
        refresh: responseData.refresh,
        admin_id: responseData.admin_id,
        username: responseData.username,
        email: responseData.email,
        role: responseData.role,
        access_expires_at: Date.now() + (parseInt(responseData.token_lifetime.access) * 1000)
    };

    localStorage.setItem('admin_auth', JSON.stringify(adminAuthData));
};

export const getAdminAccessToken = (): string | null => {
    const adminAuth = localStorage.getItem('admin_auth');
    return adminAuth ? JSON.parse(adminAuth).access : null;
};

export const getAdminRefreshToken = (): string | null => {
    const adminAuth = localStorage.getItem('admin_auth');
    return adminAuth ? JSON.parse(adminAuth).refresh : null;
};

export const isAdminAuthenticated = (): boolean => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (!adminAuth) return false;

    const { access_expires_at } = JSON.parse(adminAuth);
    return Date.now() < access_expires_at;
};

export const getAdminAuthHeader = async (): Promise<HeadersInit> => {
    let token: string | null;
    if (!isAdminAuthenticated()) {
        token = await refreshAdminToken();
    } else {
        token = getAdminAccessToken();
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const getAdminAuthHeaderFormData = async (): Promise<HeadersInit> => {
    let token: string | null;
    if (!isAdminAuthenticated()) {
        token = await refreshAdminToken();
    } else {
        token = getAdminAccessToken();
    }
    return {
        'Authorization': `Bearer ${token}`,
    };
};

export const logout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('admin_auth')
}