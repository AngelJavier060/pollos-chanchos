import { User, AuthResponse } from '../types/auth';

export const AUTH_STORAGE_KEY = 'userData';
export const TOKEN_STORAGE_KEY = 'token';

export class AuthService {
  private tokenKey = 'token';
  private userDataKey = 'userData';

  setAuthData(data: AuthResponse): void {
    if (!data.access_token) {
      throw new Error('Token no recibido');
    }
    localStorage.setItem(this.tokenKey, data.access_token);
    
    // Si hay datos del usuario, los guardamos
    if (data.user) {
      localStorage.setItem(this.userDataKey, JSON.stringify(data.user));
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.rol === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserData(): User | null {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userDataKey);
    window.location.href = '/auth/admin';
  }

  setUserData(data: User): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expiry;
    } catch {
      return true;
    }
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.getUserData();
    return user ? requiredRoles.includes(user.rol) : false;
  }
}

export const authService = new AuthService();

export function checkSession() {
  const auth = new AuthService();
  if (!auth.isAuthenticated() || auth.isTokenExpired()) {
    auth.logout();
    return false;
  }
  updateLastActivity();
  return true;
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.location.href = '/auth/admin';
}

export function updateLastActivity() {
  localStorage.setItem('lastActivity', Date.now().toString());
}