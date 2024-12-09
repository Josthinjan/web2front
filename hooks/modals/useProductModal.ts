import { create } from "zustand";

interface ProductModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProductModal = create<ProductModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));