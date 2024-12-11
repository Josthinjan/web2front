"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import LoteModal from "@/components/ui/modals/LoteModal"; // Importa el modal
import { useLoteModal } from "@/hooks/modals/useLoteModal"; // Importa el hook para manejar el modal
import { ILote } from "@/interfaces/ILote"; // Importa la interfaz de lote

// Datos de ejemplo de lotes
const lotes: ILote[] = [
  { productId: 1, providerId: 101, loteCode: "L123", manufactoringDate: "2024-01-15", expirationDate: "2025-01-15", quantity: 100, isExpirable: true },
  { productId: 2, providerId: 102, loteCode: "L124", manufactoringDate: "2024-02-20", expirationDate: "2025-02-20", quantity: 200, isExpirable: false },
  { productId: 3, providerId: 103, loteCode: "L125", manufactoringDate: "2024-03-10", expirationDate: "2025-03-10", quantity: 150, isExpirable: true },
];

const LotesPage = () => {
  const loteModal = useLoteModal();
  const [lotesData, setLotesData] = useState<ILote[]>(lotes);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;
  const [showCreateLabelForm, setShowCreateLabelForm] = useState<boolean>(false);


  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(lotesData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [lotesData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return lotesData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar lote
  const handleDeleteLote = (id: string | number) => {
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
          setLotesData(lotesData.filter(lote => lote.loteCode !== id));
          Swal.fire("Eliminado", "Lote eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el lote", "error");
        }
      }
    });
  };
  const handleAddNewLabel = () => {
    setShowCreateLabelForm(true);
    loteModal.onOpen(); // Abre el modal al añadir nueva etiqueta
  };
  // Editar lote
  const handleEditLote = (lote: ILote) => {
    loteModal.onOpen(lote); // Abre el modal con los datos del lote a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Lotes</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Lote"
            type="button"
            variant="primary"
            onClick={handleAddNewLabel} // Llamar a la función para abrir el modal
          />
        </div>
        
        <LoteModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Lotes</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && lotesData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={7} // Número de columnas que deseas mostrar (ajustar a los campos de lote)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditLote} // Función para editar
                onDelete={handleDeleteLote} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay lotes para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default LotesPage;
