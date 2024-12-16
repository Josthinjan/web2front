'use client';

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
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  // Hook de fetch
  const { data: responseData, error, loading, refetch } = useFetch({ url: "/productos" });

  // Cargar los productos de la API
  useEffect(() => {
    if (responseData) {
      setProductos(responseData);
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

          setShouldRefetch(true);
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el producto", "error");
        }
      }
    });
  };

  const handleEditProduct = (product: any) => {
    productModal.onOpen(product);
    setShouldRefetch(true);
  };

  // Manejar mostrar código de barras
  // Manejar mostrar código de barras
  const handleShowBarcode = async (id: string | number) => {
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

      // Realizar el fetch a la API para obtener el código de barras
      const response = await fetch(`${config.API_BASE_URL}/producto/${id}/barcode`, {
        method: "GET", // Puede ser GET o POST, dependiendo de la API
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Mostrar el código de barras de alguna manera (por ejemplo, generando una imagen)
      Swal.fire({
        title: "Código de Barras",
        html: `
         <img src="${imageUrl}" alt="Código de Barras" id="barcodeImage" style="width: 100%; height: auto;" />
         <button id="printButton" style="margin-top: 10px;">Imprimir</button>
       `,
        icon: "info",
        showConfirmButton: false,
      });

      // Agregar evento de impresión al botón
      document.getElementById("printButton")?.addEventListener("click", () => {
        const printWindow = window.open("", "_blank");
        printWindow?.document.write(`<img src="${imageUrl}" alt="Código de Barras" style="width: 100%; height: auto;" />`);
        printWindow?.document.close();
        printWindow?.print();
      });

    } catch (error: any) {
      Swal.fire("Error", error.message || "Ocurrió un problema al obtener el código de barras", "error");
    }
  };

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false);
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
              idField="id_producto"
              onShowBarcode={handleShowBarcode} // Pasamos la función aquí
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
