"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import ComprobanteModal from "@/components/ui/modals/ComprobanteModal"; // Importa el modal
import { useComprobanteModal } from "@/hooks/modals/useComprobanteModal"; // Importa el hook para manejar el modal

export type estadoComprobante = "pendiente" | "pagado";

export interface IComprobante {
  fecha_emision: string;
  codigo_lote: string;
  usuario_id: string;
  producto_id: string;
  cantidad: number;
  precio_total: number;
  estado: estadoComprobante;
}

// Datos de ejemplo de comprobantes
const comprobantes: IComprobante[] = [
  { fecha_emision: "2024-12-01", codigo_lote: "A123", usuario_id: "user1", producto_id: "prod1", cantidad: 10, precio_total: 500, estado: "pagado" },
  { fecha_emision: "2024-12-02", codigo_lote: "B456", usuario_id: "user2", producto_id: "prod2", cantidad: 5, precio_total: 300, estado: "pendiente" },
  { fecha_emision: "2024-12-03", codigo_lote: "C789", usuario_id: "user3", producto_id: "prod3", cantidad: 20, precio_total: 1000, estado: "pagado" },
];

const ComprobantesPage = () => {
  const comprobanteModal = useComprobanteModal();
  const [comprobantesData, setComprobantesData] = useState<IComprobante[]>(comprobantes);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(comprobantesData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [comprobantesData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return comprobantesData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar comprobante
  const handleDeleteComprobante = (id: string | number) => {
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
          setComprobantesData(comprobantesData.filter(comprobante => comprobante.codigo_lote !== id));
          Swal.fire("Eliminado", "Comprobante eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el comprobante", "error");
        }
      }
    });
  };

  // Editar comprobante
  const handleEditComprobante = (comprobante: IComprobante) => {
    comprobanteModal.onOpen(comprobante); // Abre el modal con los datos del comprobante a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Comprobantes</h1>
        </div>
        
        <ComprobanteModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Comprobantes</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && comprobantesData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={6} // Número de columnas que deseas mostrar
                rowsPerPage={rowsPerPage}
                onEdit={handleEditComprobante} // Función para editar
                onDelete={handleDeleteComprobante} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay comprobantes para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ComprobantesPage;
