"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import ProviderModal from "@/components/ui/modals/ProviderModal"; // Importa el modal de proveedores
import { useProviderModal } from "@/hooks/modals/useProviderModal"; // Importa el hook para manejar el modal
import { IProvider } from "@/interfaces/IProvider"; // Importa la interfaz de proveedor

// Datos de ejemplo de proveedores
const proveedores: IProvider[] = [
  { id: 1, name: "Proveedor A", email: "proveedorA@mail.com", phone: "123456789", address: "Calle A", city: "Ciudad A", active: true },
  { id: 2, name: "Proveedor B", email: "proveedorB@mail.com", phone: "987654321", address: "Calle B", city: "Ciudad B", active: false },
  { id: 3, name: "Proveedor C", email: "proveedorC@mail.com", phone: "123123123", address: "Calle C", city: "Ciudad C", active: true },
];

const ProveedoresPage = () => {
  const providerModal = useProviderModal();
  const [proveedoresData, setProveedoresData] = useState<IProvider[]>(proveedores);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(proveedoresData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [proveedoresData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return proveedoresData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar proveedor
  const handleDeleteProvider = (id: number| string) => {
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
          setProveedoresData(proveedoresData.filter(provider => provider.id !== id));
          Swal.fire("Eliminado", "Proveedor eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el proveedor", "error");
        }
      }
    });
  };

  // Agregar nuevo proveedor
  const handleAddNewProvider = () => {
    providerModal.onOpen(); // Abre el modal al añadir nuevo proveedor
  };

  // Editar proveedor
  const handleEditProvider = (provider: IProvider) => {
    providerModal.onOpen(provider); // Abre el modal con los datos del proveedor a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Proveedores</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Proveedor"
            type="button"
            variant="primary"
            onClick={handleAddNewProvider} // Llamar a la función para abrir el modal
          />
        </div>
        
        <ProviderModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Proveedores</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && proveedoresData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={6} // Número de columnas que deseas mostrar (ajustar a los campos de proveedor)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditProvider} // Función para editar
                onDelete={handleDeleteProvider} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay proveedores para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProveedoresPage;
