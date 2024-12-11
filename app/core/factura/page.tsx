"use client";

import React, { useState } from "react";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Table from "@/components/shared/Table/Table";
import Label from "@/components/ui/label/Label";

const facturas = [
  {
    fechaPago: "2024-12-07",
    usuario: "Luis Pérez",
    metodoPago: "Transferencia Bancaria",
    orderId: "ORD123462",
    orderIdPaypal: "PP-2233445566",
    total: "$500.00",
    estado: "Pendiente",
    acciones: "Editar | Eliminar",
  },
];

const FacturasPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(facturas.length / rowsPerPage);

  // Obtener datos paginados
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return facturas.slice(startIndex, endIndex);
  };

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Manejar edición de factura
  const handleEdit = (factura: any) => {
    console.log("Editar factura", factura);
  };

  // Manejar eliminación de factura
  const handleDelete = (factura: any) => {
    console.log("Eliminar factura", factura);
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Facturas</h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Facturas</h2>
          {facturas.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={7}
                rowsPerPage={rowsPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
            <Label type="info" text="No hay facturas para mostrar." />
          )}
        </div>
      </div>
    </main>
  );
};

export default FacturasPage;
