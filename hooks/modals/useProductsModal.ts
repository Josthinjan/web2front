import { create } from "zustand";
import { IProducts } from "@/interfaces/IProducts"; // Asegúrate de importar correctamente IProduct

interface ProductsModalState {
  isOpen: boolean;
  productToEdit: IProducts | null; // Producto que se está editando
  onOpen: (product?: IProducts) => void; // Puede recibir un producto a editar
  onClose: () => void;
}

export const useProductsModal = create<ProductsModalState>((set) => ({
  isOpen: false,
  productToEdit: null, // Inicialmente no hay ningún producto para editar
  onOpen: (product?: IProducts) => set({
    isOpen: true,
    productToEdit: product || null, // Si no se pasa un producto, limpia el productToEdit
  }),
  onClose: () => set({ isOpen: false, productToEdit: null }), // Cerrar y resetear el producto en edición
}));
