import { create } from "zustand";
import { IReturn } from "@/interfaces/IReturn"; // Asegúrate de importar correctamente IReturn

interface ReturnModalState {
  isOpen: boolean;
  returnToEdit: IReturn | null; // Retorno que se está editando
  onOpen: (retorno?: IReturn) => void; // Puede recibir un retorno a editar
  onClose: () => void;
}

export const useReturnModal = create<ReturnModalState>((set) => ({
  isOpen: false,
  returnToEdit: null, // Inicialmente no hay ningún retorno para editar
  onOpen: (retorno?: IReturn) => set({
    isOpen: true,
    returnToEdit: retorno || null // Si no se pasa un retorno, limpia el returnToEdit
  }),
  onClose: () => set({ isOpen: false, returnToEdit: null }), // Cerrar y resetear el retorno en edición
}));
