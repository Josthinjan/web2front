// useReturnsModal.ts
import { create } from "zustand";

interface ReturnsModalStore {
  isOpen: boolean;
  retornoToEdit: any | null; // Datos del retorno que se editarán
  onOpen: (retorno?: any) => void; // Abre el modal con datos de retorno (si hay)
  onClose: () => void; // Cierra el modal y resetea el retorno
}

const useReturnsModal = create<ReturnsModalStore>((set) => ({
  isOpen: false,
  retornoToEdit: null,
  onOpen: (retorno?: any) => set({ isOpen: true, retornoToEdit: retorno || null }),
  onClose: () => set({ isOpen: false, retornoToEdit: null }),
}));

export default useReturnsModal;
