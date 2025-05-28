import { getAdminAuthHeader, getAdminRefreshToken, getAuthHeader, getRefreshToken, isAdminAuthenticated, isAuthenticated } from "./auth";
import { BASE_URL } from "./host";

// api.ts
export const authFetch = async (input: RequestInfo, init?: RequestInit) => {
    // 1. Ajoute le token d'accès dans les en-têtes
    const headers: HeadersInit = {
        ...await getAuthHeader(),
        ...(init?.headers || {}),
    };

    // 2. Vérifie si l'utilisateur est authentifié
    if (isAuthenticated()) {
        return fetch(input, { ...init, headers });
    }

    // 3. Si le token est expiré, tente de le rafraîchir
    try {
        const newToken = await refreshToken();
        (headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return fetch(input, { ...init, headers });
    } catch (error) {
        // 4. Si le rafraîchissement échoue, déconnecte l'utilisateur
        logout();
        throw error;
    }
};
export const authFetchAdmin = async (input: RequestInfo, init?: RequestInit) => {
    // 1. Ajoute le token d'accès dans les en-têtes
    const headers: HeadersInit = {
        ...await getAdminAuthHeader(),
        ...(init?.headers || {}),
    };

    // 2. Vérifie si l'utilisateur est authentifié
    if (isAdminAuthenticated()) {
        return fetch(input, { ...init, headers });
    }

    // 3. Si le token est expiré, tente de le rafraîchir
    try {
        const newToken = await refreshToken();
        (headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return fetch(input, { ...init, headers });
    } catch (error) {
        // 4. Si le rafraîchissement échoue, déconnecte l'utilisateur
        logout();
        throw error;
    }
};

export const refreshToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();

    const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const newAccessExpiresAt = Date.now() + 10 * 60 * 1000;

    // Mettre à jour uniquement le token d'accès dans localStorage
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    authData.access = data.access;
    authData.access_expires_a = newAccessExpiresAt;
    localStorage.setItem('auth', JSON.stringify(authData));

    return data.access;
};

export const refreshAdminToken = async (): Promise<string> => {
    const refreshToken = getAdminRefreshToken();

    const response = await fetch(`${BASE_URL}/api/auth/token/refresh/admin/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const newAccessExpiresAt = Date.now() + 10 * 60 * 1000;

    const authData = JSON.parse(localStorage.getItem('admin_auth') || '{}');
    authData.access = data.access;
    authData.access_expires_a = newAccessExpiresAt;
    localStorage.setItem('admin_auth', JSON.stringify(authData));

    return data.access;
};

export const logout = () => {
    // Supprime les données d'authentification et redirige vers la page de connexion
    localStorage.removeItem('auth');
    window.location.href = '/login';
};