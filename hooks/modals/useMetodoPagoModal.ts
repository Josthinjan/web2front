import { create } from "zustand";
import { IMetodoPago } from "@/interfaces/IMetodoPago"; // Asegúrate de importar correctamente IMetodoPago

interface MetodoPagoModalState {
  isOpen: boolean;
  metodoPagoToEdit: IMetodoPago | null; // Método de pago que se está editando
  onOpen: (metodoPago?: IMetodoPago) => void; // Puede recibir un método de pago a editar
  onClose: () => void;
}

// useMetodoPagoModal.ts (hook)
export const useMetodoPagoModal = create<MetodoPagoModalState>((set) => ({
    isOpen: false,
    metodoPagoToEdit: null, // Inicialmente no hay ningún método de pago para editar
    onOpen: (metodoPago?: IMetodoPago) => set({
      isOpen: true,
      metodoPagoToEdit: metodoPago || null, // Si se pasa un método de pago, se asigna; si no, se restablece a null
    }),
    onClose: () => set({ isOpen: false, metodoPagoToEdit: null }), // Cerrar y resetear el estado
  }));
  
