import { create } from 'zustand';

interface ProviderModalState {
  isOpen: boolean;
  providerToEdit: any | null;  // Agrega esta línea
  onOpen: (provider?: any) => void;  // Modifica esto
  onClose: () => void;
}

export const useProviderModal = create<ProviderModalState>((set) => ({
  isOpen: false,
  providerToEdit: null,  // Inicializa esto
  onOpen: (provider) => set({ isOpen: true, providerToEdit: provider || null }),
  onClose: () => set({ isOpen: false, providerToEdit: null }),
}));