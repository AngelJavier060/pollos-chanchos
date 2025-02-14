import { authService } from './auth';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// API client class
export class ApiClient {
  private baseUrl = 'http://localhost:8000';

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || `Error: ${response.status} ${response.statusText}`
      };
    }

    try {
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al procesar la respuesta del servidor'
      };
    }
  }

  public async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  }

  public async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  }

  public async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  }
}

// Export API client instance
export const api = new ApiClient();