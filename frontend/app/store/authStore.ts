import create from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: any;
  login: (credentials: {usuario: string, password: string}) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (credentials) => {
    // Autenticación simple
    if (credentials.usuario === 'admin' && credentials.password === 'admin123') {
      set({ 
        isAuthenticated: true,
        user: {
          id: 1,
          nombre: 'Admin',
          rol: 'admin'
        }
      });
    } else {
      throw new Error('Credenciales incorrectas');
    }
  },
  logout: () => set({ isAuthenticated: false, user: null })
})); 