import { create } from "zustand";
import { ILote } from "@/interfaces/ILote"; // Asegúrate de importar correctamente ILote

interface LoteModalState {
  isOpen: boolean;
  loteToEdit: ILote | null; // Lote que se está editando
  onOpen: (lote?: ILote) => void; // Puede recibir un lote a editar
  onClose: () => void;
}

export const useLoteModal = create<LoteModalState>((set) => ({
  isOpen: false,
  loteToEdit: null, // Inicialmente no hay ningún lote para editar
  onOpen: (lote?: ILote) => set({ isOpen: true, loteToEdit: lote || null }), // Si se pasa un lote, se asigna
  onClose: () => set({ isOpen: false, loteToEdit: null }), // Cerrar y resetear el lote en edición
}));
