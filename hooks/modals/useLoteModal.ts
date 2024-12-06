import { create } from 'zustand';

interface LoteModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useLoteModal = create<LoteModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));