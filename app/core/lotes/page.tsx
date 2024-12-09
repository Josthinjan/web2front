"use client";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import FormCheckbox from "@/components/shared/Form/FormCheckbox";
import Button from "@/components/shared/Button/Button";
import { ILote } from "@/interfaces/ILote";
import { useFetch } from "@/hooks/useFetch";
import { IProducts } from "@/interfaces/IProducts";
import { IProvider } from "@/interfaces/IProvider";
import Label from "@/components/ui/label/Label";
import { useLoteModal } from "@/hooks/modals/useLoteModal";
import LoteModal from "@/components/ui/modals/LoteModal";
import Table from "@/components/shared/Table/Table";


const Page = () => {
  const token = "asdasd";
  const loteModal = useLoteModal();
  const [formData, setFormData] = useState<ILote>({
    productId: 0,
    providerId: 0,
    expirationDate: "",
    isExpirable: false,
    manufactoringDate: "",
    loteCode: "",
    quantity: 0,
  });

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useFetch({
    url: `${config.API_BASE_URL}/products`,
  });

  const newProductsData = productsData.map((product: IProducts) => {
    return {
      value: product.id,
      name: product.name,
    };
  });

  if (productsError) {
    console.log(productsError);
  }

  const {
    data: providersData,
    loading: providersLoading,
    error: providersError,
  } = useFetch({
    url: `${config.API_BASE_URL}/provider`,
  });

  const newProvidersData = providersData.map((provider: IProvider) => {
    return {
      value: provider.id,
      name: provider.name,
    };
  });

  if (providersError) {
    console.log(providersError);
  }

  const {
    data: lotesData,
    loading: lotesLoading,
    error: lotesError,
  } = useFetch({
    url: `${config.API_BASE_URL}/lotes`,
  });

  if (lotesError) {
    console.log(lotesError);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const lotes = [
    {
      "productId": 101,
      "providerId": 202,
      "expirationDate": "2025-12-31",
      "isExpirable": true,
      "manufactoringDate": "2023-06-15",
      "loteCode": "LT12345",
      "quantity": 50
    },
    {
      "productId": 102,
      "providerId": 203,
      "expirationDate": "2024-11-15",
      "isExpirable": true,
      "manufactoringDate": "2023-05-10",
      "loteCode": "LT12346",
      "quantity": 150
    },
    {
      "productId": 103,
      "providerId": 204,
      "expirationDate": "2026-01-20",
      "isExpirable": true,
      "manufactoringDate": "2023-08-01",
      "loteCode": "LT12347",
      "quantity": 200
    },
    {
      "productId": 104,
      "providerId": 205,
      "expirationDate": "2024-06-30",
      "isExpirable": true,
      "manufactoringDate": "2023-03-12",
      "loteCode": "LT12348",
      "quantity": 75
    },
    {
      "productId": 105,
      "providerId": 206,
      "expirationDate": "2025-09-25",
      "isExpirable": true,
      "manufactoringDate": "2023-07-20",
      "loteCode": "LT12349",
      "quantity": 120
    },
    {
      "productId": 106,
      "providerId": 207,
      "expirationDate": "2026-05-01",
      "isExpirable": true,
      "manufactoringDate": "2023-04-10",
      "loteCode": "LT12350",
      "quantity": 300
    },
    {
      "productId": 107,
      "providerId": 208,
      "expirationDate": "2024-12-01",
      "isExpirable": true,
      "manufactoringDate": "2023-02-18",
      "loteCode": "LT12351",
      "quantity": 40
    },
    {
      "productId": 108,
      "providerId": 209,
      "expirationDate": "2025-10-10",
      "isExpirable": true,
      "manufactoringDate": "2023-09-05",
      "loteCode": "LT12352",
      "quantity": 90
    },
    {
      "productId": 109,
      "providerId": 210,
      "expirationDate": "2026-03-18",
      "isExpirable": true,
      "manufactoringDate": "2023-01-01",
      "loteCode": "LT12353",
      "quantity": 500
    },
    {
      "productId": 110,
      "providerId": 211,
      "expirationDate": "2025-07-14",
      "isExpirable": true,
      "manufactoringDate": "2023-10-30",
      "loteCode": "LT12354",
      "quantity": 250
    }
  ]
  
  const [currentPage, setCurrentPage] = useState(1);  // Declarado dentro del componente
  const rowsPerPage = 5; // Número de filas por página
  const totalPages = Math.max(1, Math.ceil(lotes.length / rowsPerPage));

  console.log(productsData);
  console.log(providersData);
  console.log(lotesData);

   // Funciones de edición y eliminación
   const handleEditProduct = (product: Record<string, any>) => {
    console.log("Edit product:", product);
  };

  const handleDeleteProduct = (id: number) => {
    console.log("Delete product with ID:", id);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginatedData = () => {
    return lotes.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)]">
      <div className="flex w-full">
        <LateralNavbar />
        <div className="flex flex-col w-full p-4">
          {lotesLoading && <Label type="info" text="Cargando lotes" />}
          {lotesError && <Label type="error" text="Error al cargar lotes" />}
          {productsLoading && <Label type="info" text="Cargando productos" />}
          {productsError && (
            <Label type="error" text="Error al cargar productos" />
          )}
          {providersLoading && <Label type="info" text="Cargando proveedores" />}
          {providersError && (
            <Label type="error" text="Error al cargar proveedores" />
          )}
          <div className="text-start w-full mb-4">
            <h1 className="text-2xl font-bold">Administración de Lotes</h1>
          </div>
          <div className="flex gap-3 justify-start items-center mb-6">
            <Button
              label="Añadir Nuevo Lote"
              type="button"
              variant="primary"
              onClick={loteModal.onOpen}
            />
          </div>
          <LoteModal />
          <Table
            data={getPaginatedData()}
            columns={5}
            rowsPerPage={rowsPerPage}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
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

export default Page;
