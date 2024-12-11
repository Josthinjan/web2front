import { create } from "zustand";
import { IProvider } from "@/interfaces/IProvider"; // Asegúrate de importar correctamente IProvider

interface ProviderModalState {
  isOpen: boolean;
  providerToEdit: IProvider | null; // Proveedor que se está editando
  onOpen: (provider?: IProvider) => void; // Puede recibir un proveedor a editar
  onClose: () => void;
}

export const useProviderModal = create<ProviderModalState>((set) => ({
  isOpen: false,
  providerToEdit: null, // Inicialmente no hay ningún proveedor para editar
  onOpen: (provider?: IProvider) => set({ 
    isOpen: true, 
    providerToEdit: provider || null // Si no se pasa un proveedor, limpia el providerToEdit
  }),
  onClose: () => set({ isOpen: false, providerToEdit: null }), // Cerrar y resetear el proveedor en edición
}));
