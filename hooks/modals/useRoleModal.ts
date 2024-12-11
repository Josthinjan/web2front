import { create } from "zustand";
import { IRole } from "@/interfaces/IRole"; // Asegúrate de importar correctamente IRole

interface RoleModalState {
  isOpen: boolean;
  roleToEdit: IRole | null; // Rol que se está editando
  onOpen: (role?: IRole) => void; // Puede recibir un rol a editar
  onClose: () => void;
}

export const useRoleModal = create<RoleModalState>((set) => ({
  isOpen: false,
  roleToEdit: null, // Inicialmente no hay ningún rol para editar
  onOpen: (role?: IRole) => set({ isOpen: true, roleToEdit: role || null }), // Si se pasa un rol, se asigna
  onClose: () => set({ isOpen: false, roleToEdit: null }), // Cerrar y resetear el rol en edición
}));
