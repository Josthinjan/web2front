import { create } from 'zustand';
import { IProducts } from '@/interfaces/IProducts';

interface ProductModalState {
  isOpen: boolean;
  productToEdit: IProducts | null;
  onOpen: (product?: IProducts) => void;
  onClose: () => void;
}

export const useProductModal = create<ProductModalState>((set) => ({
  isOpen: false,
  productToEdit: null, // Inicialmente no hay producto para editar
  onOpen: (product?: IProducts) => {
    set({
      isOpen: true,
      productToEdit: product || null, // Si no se pasa un producto, se pone en null
    });
  },
  onClose: () => set({ isOpen: false, productToEdit: null }), // Cerrar y resetear
}));
