import { create } from "zustand";

interface SitesModalStore {
  isOpen: boolean;
  sitetoedit: any; // Sitio a editar
  onOpen: (site?: any) => void; // Puede recibir un sitio a editar
  onClose: () => void; // Cierra el modal y resetea el sitio
}

const useSitesModal = create<SitesModalStore>((set) => ({
  isOpen: false,
  sitetoedit: null, // Inicialmente no hay ningún sitio para editar
  onOpen: (site?: any) => set({ isOpen: true, sitetoedit: site || null }), // Si se pasa un sitio, lo asigna
  onClose: () => set({ isOpen: false, sitetoedit: null }), // Cierra y resetea el sitio en edición
}));

export default useSitesModal;
