"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Table from "@/components/shared/Table/Table";

// Función para obtener los métodos de pago del backend con paginación
const fetchMetodosPago = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/metodo-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al obtener los métodos de pago");
  }
  const data = await response.json();
  return data;
};

const samplePaymentMethods = [
  {
    id: "1",
    nombre: "Tarjeta de Crédito",
    descripcion: "Pago con tarjeta de crédito Visa, Mastercard, o American Express.",
  },
  {
    id: "2",
    nombre: "PayPal",
    descripcion: "Pago a través de PayPal, el servicio de pagos en línea.",
  },
  {
    id: "3",
    nombre: "Transferencia Bancaria",
    descripcion: "Pago mediante transferencia desde tu cuenta bancaria.",
  },
  {
    id: "4",
    nombre: "Crypto (Bitcoin, Ethereum)",
    descripcion: "Pago mediante criptomonedas como Bitcoin y Ethereum.",
  },
  {
    id: "5",
    nombre: "Pago en Efectivo",
    descripcion: "Opción de pago en efectivo al momento de la entrega o en puntos de pago.",
  },
];

const MetodosPagoPage = () => {
  const [currentPage, setCurrentPage] = useState(1);  // Declarado dentro del componente
  const rowsPerPage = 5; // Número de filas por página
  const totalPages = Math.max(1, Math.ceil(samplePaymentMethods.length / rowsPerPage)); // Esto depende de `samplePaymentMethods.length`

  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("nombre");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const loadMetodosPago = async () => {
      try {
        const data = await fetchMetodosPago(currentPage, sortField, sortOrder);
        setMetodosPago(data.data);
      } catch (err) {
        setError("Error al cargar los métodos de pago.");
      } finally {
        setLoading(false);
      }
    };

    loadMetodosPago();
  }, [currentPage, sortField, sortOrder]);

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

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
      return samplePaymentMethods.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
    };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar /> 
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">
            Administración de Métodos de Pago
          </h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">
            Lista de Métodos de Pago
          </h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            {/* tabla */}
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

export default MetodosPagoPage;
