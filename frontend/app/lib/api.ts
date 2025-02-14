import { authService } from './auth';
import { cacheService } from './cache';
import { handleError } from './errorHandler';
import { ApiError } from '../types/auth';

// API client class
export class ApiClient {
  private baseUrl = 'http://localhost:8000';
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise(resolve => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      const data = await response.json();
      authService.setToken(data.access_token);
      
      this.refreshSubscribers.forEach(cb => cb(data.access_token));
      this.refreshSubscribers = [];
      
      return data.access_token;
    } catch (error) {
      authService.logout();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Token incluido en headers:', token);
    } else {
      console.warn('No hay token disponible');
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Error al parsear respuesta:', e);
      throw new Error('Error al procesar la respuesta del servidor');
    }

    if (!response.ok) {
      console.error('Error en la respuesta:', {
        status: response.status,
        statusText: response.statusText,
        data
      });

      // Manejar diferentes tipos de errores
      switch (response.status) {
        case 401:
          authService.logout();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        case 403:
          throw new Error('No tiene permisos para realizar esta acción');
        case 404:
          throw new Error('Recurso no encontrado');
        case 422:
          throw new Error('Datos inválidos');
        case 500:
          throw new Error('Error interno del servidor');
        default:
          throw new Error(data.detail || 'Error en la petición');
      }
    }

    return data;
  }

  async get<T>(url: string, useCache = true, cacheTTL?: number): Promise<T> {
    try {
      console.log('Haciendo GET a:', `${this.baseUrl}${url}`);
      // Intentar obtener del caché
      if (useCache) {
        const cachedData = cacheService.get<T>(url);
        if (cachedData) return cachedData;
      }

      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en respuesta:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }

      const data = await this.handleResponse<T>(response);
      
      // Guardar en caché si corresponde
      if (useCache) {
        cacheService.set(url, data, cacheTTL);
      }

      console.log('Respuesta exitosa:', data);
      return data;
    } catch (error) {
      console.error('Error completo:', error);
      handleError(error as ApiError);
      throw error;
    }
  }

  async post<T>(url: string, data: any): Promise<T> {
    try {
      console.log('Haciendo POST a:', `${this.baseUrl}${url}`, 'con datos:', data);
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en respuesta POST:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Respuesta POST exitosa:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error completo POST:', error);
      handleError(error as ApiError);
      throw error;
    }
  }

  async put<T>(url: string, data: any): Promise<T> {
    try {
      console.log('Haciendo PUT a:', `${this.baseUrl}${url}`, 'con datos:', data);
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en respuesta PUT:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Respuesta PUT exitosa:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error completo PUT:', error);
      handleError(error as ApiError);
      throw error;
    }
  }

  async delete(url: string): Promise<void> {
    try {
      console.log('Haciendo DELETE a:', `${this.baseUrl}${url}`);
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en respuesta DELETE:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Error completo DELETE:', error);
      handleError(error as ApiError);
      throw error;
    }
  }
}

// Export API client instance
export const api = new ApiClient();