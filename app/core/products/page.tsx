"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { useProductsModal } from "@/hooks/modals/useProductsModal";
import ProductsModal from "@/components/ui/modals/ProductsModal";
import { useFetch } from "@/hooks/useFetch";
import Table from "@/components/shared/Table/Table";
import Label from "@/components/ui/label/Label";

const ProductsPage = () => {
  const productModal = useProductsModal();
  const [productos, setProductos] = useState<Array<Record<string, any>>>([]);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false); // Estado para controlar el refetch

  // Hook de fetch
  const { data: responseData, error, loading, refetch } = useFetch({ url: "/productos" });

  // Cargar los productos de la API
  useEffect(() => {
    if (responseData) {
      console.log("Datos recibidos de la API:", responseData);
      setProductos(responseData); // Asignar directamente el array de productos
    } else {
      console.log("No se recibieron datos o la respuesta está vacía.");
    }
  }, [responseData]);

  useEffect(() => {
    if (error) {
      console.error("Error al obtener los productos:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      console.log("Cargando productos...");
    }
  }, [loading]);

  useEffect(() => {
    console.log("Estado de productos:", productos); // Verificar que 'productos' tiene datos
  }, [productos]);

  const handleAddNewProduct = () => {
    productModal.onOpen();
  };

  const handleDeleteProduct = async (id: number | string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = sessionStorage.getItem("token") || 
            document.cookie.split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1];

          const tenant = sessionStorage.getItem("X_Tenant");

          if (!tenant) {
            Swal.fire("Error", "El tenant no está especificado", "error");
            return;
          }

          const headers: HeadersInit = {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "X-Tenant": tenant,
          };

          const response = await fetch(`${config.API_BASE_URL}/productos/${id}`, {
            method: "DELETE",
            headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
          
          // Marcar que necesitamos refetch de los datos
          setShouldRefetch(true); 
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el producto", "error");
        }
      }
    });
  };

  const handleEditProduct = (product: any) => {
    productModal.onOpen(product);
    // Marcar que necesitamos refetch de los datos después de editar
    setShouldRefetch(true);
  };

  // Refetch los datos cuando se haya marcado
  useEffect(() => {
    if (shouldRefetch) {
      refetch(); // Recargar los datos cuando se haya marcado
      setShouldRefetch(false); // Restablecer el estado
    }
  }, [shouldRefetch, refetch]);

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
            onClick={handleAddNewProduct}
          />
        </div>
        <ProductsModal setShouldRefetch={setShouldRefetch} />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Productos Disponibles</h2>
          {loading && <Label type="info" text="Cargando productos..." />}
          {error && <Label type="error" text="Error al cargar los datos." />}
          {!loading && !error && productos.length === 0 && (
            <Label type="info" text="No hay productos para mostrar." />
          )}
          {!loading && !error && productos.length > 0 && (
            <Table
              data={productos}
              columns={5}
              rowsPerPage={5}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
