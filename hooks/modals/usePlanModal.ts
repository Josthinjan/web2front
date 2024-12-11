import { create } from "zustand";
import { IPlan } from "@/interfaces/IPlan"; // Asegúrate de importar correctamente IPlan

interface PlanModalState {
  isOpen: boolean;
  planToEdit: IPlan | null; // Plan que se está editando
  onOpen: (plan?: IPlan) => void; // Puede recibir un plan a editar
  onClose: () => void;
}

export const usePlanModal = create<PlanModalState>((set) => ({
    isOpen: false,
    planToEdit: null, // Inicialmente no hay plan para editar
    onOpen: (plan?: IPlan) => set({ isOpen: true, planToEdit: plan || null }), // Si se pasa un plan, se asigna
    onClose: () => set({ isOpen: false, planToEdit: null }), // Cerrar y resetear el plan en edición
  }));
  
