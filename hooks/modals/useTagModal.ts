import { create } from "zustand";

interface TagModalState {
  isOpen: boolean;
  tagToEdit: any; // Etiqueta que se está editando
  onOpen: (tag?: any) => void; // Puede recibir una etiqueta a editar
  onClose: () => void;
}

export const useTagModal = create<TagModalState>((set) => ({
  isOpen: false,
  tagToEdit: null, // Inicialmente no hay ninguna etiqueta para editar
  onOpen: (tag?: any) => set({ isOpen: true, tagToEdit: tag || null }), // Si se pasa una etiqueta, se asigna
  onClose: () => set({ isOpen: false, tagToEdit: null }), // Cerrar y resetear la etiqueta en edición
}));
