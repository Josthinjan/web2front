import { StoreUser } from '@/interfaces/IStoreUser';
import { create } from 'zustand';


interface UserStore {
  user: StoreUser | null;
  setUser: (user: StoreUser) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null as StoreUser | null,
  setUser: (user: StoreUser) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useUserStore;