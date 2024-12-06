import { create } from 'zustand';

interface ProviderModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProviderModal = create<ProviderModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));