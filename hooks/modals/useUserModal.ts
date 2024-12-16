import { create } from "zustand";

interface UserModalState {
  isOpen: boolean;
  userToEdit: any; // Usuario que se está editando
  onOpen: (user?: any) => void; // Puede recibir un usuario a editar
  onClose: () => void;
}

export const useUserModal = create<UserModalState>((set) => ({
  isOpen: false,
  userToEdit: null, // Inicialmente no hay ningún usuario para editar
  onOpen: (user?: any) => set({ isOpen: true, userToEdit: user || null }), // Si se pasa un usuario, se asigna
  onClose: () => set({ isOpen: false, userToEdit: null }), // Cerrar y resetear el usuario en edición
}));
