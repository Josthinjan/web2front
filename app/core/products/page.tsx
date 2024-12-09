"use client";

import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import Label from "@/components/ui/label/Label";
import ProductModal from "@/components/ui/modals/ProductModal";
import Table from "@/components/shared/Table/Table"; // Asegúrate de usar la tabla reutilizable
import { useProductModal } from "@/hooks/modals/useProductModal";

const ProductsPage = () => {
  const productModal = useProductModal();
  const [currentPage, setCurrentPage] = useState(1);

  // Datos quemados de ejemplo
  const products = [
    {
      id: 1,
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón 100% con diseño único.",
      precio: 19.99,
      tipoProducto: "Ropa",
      estado: "Disponible",
    },
    {
      id: 2,
      nombre: "Auriculares",
      descripcion: "Auriculares inalámbricos con cancelación de ruido.",
      precio: 59.99,
      tipoProducto: "Electrónica",
      estado: "Disponible",
    },
    {
      id: 3,
      nombre: "Taza personalizada",
      descripcion: "Taza de cerámica con impresión a medida.",
      precio: 12.5,
      tipoProducto: "Accesorios",
      estado: "Agotado",
    },
    {
      id: 4,
      nombre: "Laptop",
      descripcion: "Laptop de 15 pulgadas, 8GB RAM, 256GB SSD.",
      precio: 899.99,
      tipoProducto: "Electrónica",
      estado: "Disponible",
    },
    {
      id: 5,
      nombre: "Mochila",
      descripcion: "Mochila resistente al agua con múltiples compartimentos.",
      precio: 45.0,
      tipoProducto: "Accesorios",
      estado: "Disponible",
    },
    {
      id: 6,
      nombre: "Libro de cocina",
      descripcion: "Recetario con más de 200 recetas internacionales.",
      precio: 24.99,
      tipoProducto: "Libros",
      estado: "Agotado",
    },
    {
      id: 7,
      nombre: "Silla ergonómica",
      descripcion: "Silla ergonómica para oficina con soporte lumbar ajustable.",
      precio: 129.99,
      tipoProducto: "Muebles",
      estado: "Disponible",
    },
  ];

  const rowsPerPage = 5; // Número de filas por página
  const totalPages = Math.max(1, Math.ceil(products.length / rowsPerPage));

  const getPaginatedData = () => {
    return products.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditProduct = (product: Record<string, any>) => {
    console.log("Edit product:", product);
  };

  const handleDeleteProduct = (id: number) => {
    console.log("Delete product with ID:", id);
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Productos</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Producto"
            type="button"
            variant="primary"
            onClick={productModal.onOpen}
          />
        </div>
        <ProductModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Productos Disponibles</h2>
          {products.length === 0 && (
            <Label type="info" text="No hay productos disponibles" />
          )}
          <div className="overflow-x-auto">
            <Table
              data={getPaginatedData()}
              columns={5}
              rowsPerPage={rowsPerPage}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
          {/* Paginación */}
          <div className="flex justify-between mt-4 w-full">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="font-semibold">{currentPage} / {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
