"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import MetodoPagoModal from "@/components/ui/modals/MetodoPagoModal"; // Importa el modal
import { useMetodoPagoModal } from "@/hooks/modals/useMetodoPagoModal"; // Importa el hook para manejar el modal
import { IMetodoPago } from "@/interfaces/IMetodoPago"; // Importa la interfaz de metodo de pago

// Datos de ejemplo de métodos de pago
const metodosPago: IMetodoPago[] = [
  { id: 1, nombre: "Tarjeta de Crédito", descripcion: "Pago a través de tarjeta de crédito" },
  { id: 2, nombre: "Transferencia Bancaria", descripcion: "Pago mediante transferencia desde banco" },
  { id: 3, nombre: "PayPal", descripcion: "Pago a través de cuenta de PayPal" },
];

const MetodosPagoPage = () => {
  const metodoPagoModal = useMetodoPagoModal();
  const [metodosPagoData, setMetodosPagoData] = useState<IMetodoPago[]>(metodosPago);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(metodosPagoData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [metodosPagoData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return metodosPagoData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar método de pago
  const handleDeleteMetodoPago = (id: string | number) => {
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
          setMetodosPagoData(metodosPagoData.filter(metodo => metodo.id !== id));
          Swal.fire("Eliminado", "Método de pago eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el método de pago", "error");
        }
      }
    });
  };

  const handleAddNewMetodoPago = () => {
    metodoPagoModal.onOpen(); // Abre el modal para agregar nuevo método de pago
  };

  // Editar método de pago
  const handleEditMetodoPago = (metodo: IMetodoPago) => {
    metodoPagoModal.onOpen(metodo); // Abre el modal con los datos del método de pago a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Métodos de Pago</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Método de Pago"
            type="button"
            variant="primary"
            onClick={handleAddNewMetodoPago} // Llamar a la función para abrir el modal
          />
        </div>
        
        <MetodoPagoModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Métodos de Pago</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && metodosPagoData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={3} // Número de columnas que deseas mostrar (ajustar a los campos del método de pago)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditMetodoPago} // Función para editar
                onDelete={handleDeleteMetodoPago} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay métodos de pago para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default MetodosPagoPage;
