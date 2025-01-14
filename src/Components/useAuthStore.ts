import { create } from 'zustand';

interface AuthStore {
  user: string | null; 
  login: (user: string) => void; 
  logout: () => void; 
  checkUser: (id?: string) => boolean; 
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null, 
  login: (user: string) => set({ user }),
  logout: () => set({ user: null }),
  checkUser: (id?: string) => {
    const state = get();
    return id ? state.user === id : state.user !== null; 
  },
}));

export default useAuthStore;
