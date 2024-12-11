import { create } from "zustand";
import { IComprobante } from "@/interfaces/IComprobante"; // Asegúrate de importar correctamente IComprobante

interface ComprobanteModalState {
  isOpen: boolean;
  comprobanteToEdit: IComprobante | null; // Comprobante que se está editando
  onOpen: (comprobante?: IComprobante) => void; // Puede recibir un comprobante a editar
  onClose: () => void;
}

export const useComprobanteModal = create<ComprobanteModalState>((set) => ({
  isOpen: false,
  comprobanteToEdit: null, // Inicialmente no hay ningún comprobante para editar
  onOpen: (comprobante?: IComprobante) => set({ isOpen: true, comprobanteToEdit: comprobante || null }), // Si se pasa un comprobante, se asigna
  onClose: () => set({ isOpen: false, comprobanteToEdit: null }), // Cerrar y resetear el comprobante en edición
}));
