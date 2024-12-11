import { create } from "zustand";

interface ClientModalState {
  isOpen: boolean;
  clientToEdit: any; // Cliente que se está editando
  onOpen: (client?: any) => void; // Puede recibir un cliente a editar
  onClose: () => void;
}

export const useClientModal = create<ClientModalState>((set) => ({
  isOpen: false,
  clientToEdit: null, // Inicialmente no hay ningún cliente para editar
  onOpen: (client?: any) => set({ isOpen: true, clientToEdit: client || null }), // Si se pasa un cliente, se asigna
  onClose: () => set({ isOpen: false, clientToEdit: null }), // Cerrar y resetear el cliente en edición
}));
