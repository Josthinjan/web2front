import { create } from "zustand";
import { ISite } from "@/interfaces/ISite"; // Asegúrate de importar correctamente ISite

interface SiteModalState {
  isOpen: boolean;
  siteToEdit: ISite | null; // Sitio que se está editando
  onOpen: (site?: ISite) => void; // Puede recibir un sitio a editar
  onClose: () => void;
}

export const useSiteModal = create<SiteModalState>((set) => ({
  isOpen: false,
  siteToEdit: null, // Inicialmente no hay ningún sitio para editar
  onOpen: (site?: ISite) => set({
    isOpen: true,
    siteToEdit: site || null, // Si no se pasa un sitio, limpia el siteToEdit
  }),
  onClose: () => set({ isOpen: false, siteToEdit: null }), // Cerrar y resetear el sitio en edición
}));
