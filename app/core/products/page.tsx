"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import ProductModal from "@/components/ui/modals/ProductModal"; // Importa el modal para los productos
import { useProductModal } from "@/hooks/modals/useProductModal"; // Importa el hook para manejar el modal
import { IProducts } from "@/interfaces/IProducts"; // Importa la interfaz de productos

// Datos de ejemplo de productos
const products: IProducts[] = [
  { id: 1, name: "Producto 1", description: "Descripción del producto 1", price: 50, quantity: 100, categoriId: 1, tagId: 1 },
  { id: 2, name: "Producto 2", description: "Descripción del producto 2", price: 30, quantity: 200, categoriId: 2, tagId: 2 },
  { id: 3, name: "Producto 3", description: "Descripción del producto 3", price: 20, quantity: 150, categoriId: 3, tagId: 3 },
];

const ProductsPage = () => {
  const productModal = useProductModal();
  const [productsData, setProductsData] = useState<IProducts[]>(products);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(productsData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [productsData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return productsData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = (id: number| string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProductsData(productsData.filter(product => product.id !== id));
          Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el producto", "error");
        }
      }
    });
  };

  const handleAddNewProduct = () => {
    productModal.onOpen(); // Abre el modal para añadir un nuevo producto
  };

  // Editar producto
  const handleEditProduct = (product: IProducts) => {
    productModal.onOpen(product); // Abre el modal con los datos del producto a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Productos</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Producto"
            type="button"
            variant="primary"
            onClick={handleAddNewProduct} // Llamar a la función para abrir el modal
          />
        </div>

        <ProductModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Productos</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && productsData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={5} // Número de columnas que deseas mostrar (ajustar a los campos de producto)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditProduct} // Función para editar
                onDelete={handleDeleteProduct} // Función para eliminar
              />
              <div className="flex justify-between mt-4 w-full">
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          ) : (
            !loading && <p className="text-gray-500">No hay productos para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
