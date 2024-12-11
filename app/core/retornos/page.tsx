"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import ReturnModal from "@/components/ui/modals/ReturnModal"; // Modal para los retornos
import { useReturnModal } from "@/hooks/modals/useReturnModal"; // Hook para manejar el modal
import { IReturn } from "@/interfaces/IReturn"; // Interfaz de retorno

// Datos de ejemplo de retornos
const retornos: IReturn[] = [
  {
    fechaRetorno: "2024-11-29",
    codigoLote: "E778899",
    nombreUsuario: "José Rodríguez",
    nombreProducto: "Teclado mecánico Logitech G Pro",
    cantidad: 1,
    motivoRetorno: "Teclas atascadas",
    estado: "Procesado",
  },
  {
    fechaRetorno: "2024-11-30",
    codigoLote: "E779900",
    nombreUsuario: "María López",
    nombreProducto: "Mouse inalámbrico Razer",
    cantidad: 1,
    motivoRetorno: "Botones defectuosos",
    estado: "Pendiente",
  },
  {
    fechaRetorno: "2024-12-01",
    codigoLote: "E780011",
    nombreUsuario: "Carlos Pérez",
    nombreProducto: "Auriculares Sony WH-1000XM4",
    cantidad: 2,
    motivoRetorno: "Sonido distorsionado",
    estado: "Procesado",
  },
];

const RetornosPage = () => {
  const returnModal = useReturnModal();
  const [retornosData, setRetornosData] = useState<IReturn[]>(retornos);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(retornosData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [retornosData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return retornosData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar retorno
  const handleDeleteReturn = (codigoLote: string | number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setRetornosData(retornosData.filter(retorno => retorno.codigoLote !== codigoLote));
          Swal.fire("Eliminado", "Retorno eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el retorno", "error");
        }
      }
    });
  };

  // Agregar nuevo retorno
  const handleAddNewReturn = () => {
    returnModal.onOpen(); // Abre el modal al añadir un nuevo retorno
  };

  // Editar retorno
  const handleEditReturn = (retorno: IReturn) => {
    returnModal.onOpen(retorno); // Abre el modal con los datos del retorno a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Retornos</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Retorno"
            type="button"
            variant="primary"
            onClick={handleAddNewReturn} // Llamar a la función para abrir el modal
          />
        </div>

        <ReturnModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Retornos</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && retornosData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={7} // Número de columnas que deseas mostrar (ajustar a los campos de retorno)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditReturn} // Función para editar
                onDelete={handleDeleteReturn} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay retornos para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default RetornosPage;
