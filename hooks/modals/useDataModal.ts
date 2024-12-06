import { create } from "zustand";

type DataModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDataModal = create<DataModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));