"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';
import Label from "@/components/ui/label/Label";
import { useProductModal } from "@/hooks/modals/useProductModal";
import ProductModal from "@/components/ui/modals/ProductModal";



// Función para obtener los datos de productos del backend con paginación y ordenación
const fetchProducts = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/productos-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    throw new Error('Error al obtener los productos');
  }
  const data = await response.json();
  return data;
};

// Función para enviar los datos del nuevo producto al backend
const submitProductData = async (productData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Error al enviar los datos del producto');
  }
  return response.json();
};


const ProductsPage = () => {
  const productModal = useProductModal();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("nombre_producto");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [showCreateProductForm, setShowCreateProductForm] = useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(currentPage, sortField, sortOrder);
        setProducts(data.data);
        setTotalPages(data.last_page);
      } catch (err) {
        setError("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, sortField, sortOrder]); // Recargar cuando cambie la página, el campo de orden o el orden

  const handleAddNewProduct = () => {
    setShowCreateProductForm(true);
  };

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handleSubmitProduct = async (productData: any) => {
    try {
      const newProduct = await submitProductData(productData);
      if (newProduct && newProduct.id_producto) {
        setProducts([...products, newProduct]);
        setShowCreateProductForm(false);
        Swal.fire("Éxito", "Producto creado exitosamente", "success");
      } else {
        Swal.fire("Error", "No se pudo crear el producto", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo crear el producto", "error");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
          {loading && <Label type="info" text="Cargando productos" />}
          {error && <Label type="error" text="Error al cargar los productos" />}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead className="">
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("nombre_producto")}
                  >
                    Nombre {sortField === "nombre_producto" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Descripción</th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("precio")}
                  >
                    Precio {sortField === "precio" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Tipo de Producto</th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("isActive")}
                  >
                    Estado {sortField === "isActive" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id_producto} className="text-center">
                    <td className="px-4 py-2 border-b">{product.nombre_producto}</td>
                    <td className="px-4 py-2 border-b">{product.descripcion_producto || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{`$${product.precio}`}</td>
                    <td className="px-4 py-2 border-b">{product.tipo_producto || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{product.isActive ? "Inactivo" : "Activo"}</td>
                    <td className="px-4 py-2 border-b">
                      <Button label="Editar" type="button" variant="outline" onClick={() => { }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-between mt-4">
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
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;