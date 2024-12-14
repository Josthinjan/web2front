import { create } from "zustand";

interface SiteModalStore {
  isOpen: boolean;
  siteToEdit: any;
  onOpen: (siteToEdit?: any) => void;
  onClose: () => void;
}

export const useSitesModal = create<SiteModalStore>((set) => ({
  isOpen: false,
  siteToEdit: null,
  onOpen: (siteToEdit = null) => set({ isOpen: true, siteToEdit }),
  onClose: () => set({ isOpen: false, siteToEdit: null }),
}));
