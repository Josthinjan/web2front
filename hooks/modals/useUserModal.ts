import { create } from "zustand";
import { IUser } from "@/interfaces/IUser"; // Asegúrate de importar la interfaz IUser

// Interfaz para el modal de creación de usuario
interface UserModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Interfaz para el modal de edición de usuario
interface UserEditModalProps {
  isOpen: boolean;
  userToEdit: IUser | null; // Estado para el usuario a editar
  onOpen: (user: IUser) => void; // Función para abrir el modal y pasar el usuario
  onClose: () => void;
}

// Hook para manejar el modal de creación de usuario
const useUserModal = create<UserModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

// Hook para manejar el modal de edición de usuario
const useUserEditModal = create<UserEditModalProps>((set) => ({
  isOpen: false,
  userToEdit: null, // Inicialmente no hay usuario a editar
  onOpen: (user: IUser) => set({ isOpen: true, userToEdit: user }), // Abrir el modal y pasar el usuario
  onClose: () => set({ isOpen: false, userToEdit: null }), // Cerrar el modal y limpiar el usuario
}));

// Exportar ambos hooks
export { useUserModal, useUserEditModal };
