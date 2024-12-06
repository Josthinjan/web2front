import { create } from "zustand";

type InvoiceModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useInvoiceModal = create<InvoiceModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));