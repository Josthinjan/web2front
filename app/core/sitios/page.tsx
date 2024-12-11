"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import SiteModal from "@/components/ui/modals/SiteModal"; // Importa el modal de sitios
import { useSiteModal } from "@/hooks/modals/useSiteModal"; // Importa el hook para manejar el modal
import { ISite } from "@/interfaces/ISite"; // Importa la interfaz de sitio

// Datos de ejemplo de sitios
const sitios: ISite[] = [
  { id: 1, name: "Bodega A", address: "Calle Ficticia 123", city: "Ciudad A", country: "País A" },
  { id: 2, name: "Bodega B", address: "Calle Ficticia 456", city: "Ciudad B", country: "País B" },
  { id: 3, name: "Bodega C", address: "Calle Ficticia 789", city: "Ciudad C", country: "País C" },
];

const SitiosPage = () => {
  const siteModal = useSiteModal();
  const [sitiosData, setSitiosData] = useState<ISite[]>(sitios);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(sitiosData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [sitiosData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sitiosData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar sitio
  const handleDeleteSite = (id: number | string) => {
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
          setSitiosData(sitiosData.filter(site => site.id !== id));
          Swal.fire("Eliminado", "Sitio eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el sitio", "error");
        }
      }
    });
  };

  // Agregar nuevo sitio
  const handleAddNewSite = () => {
    siteModal.onOpen(); // Abre el modal al añadir nuevo sitio
  };

  // Editar sitio
  const handleEditSite = (site: ISite) => {
    siteModal.onOpen(site); // Abre el modal con los datos del sitio a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Sitios</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Sitio"
            type="button"
            variant="primary"
            onClick={handleAddNewSite} // Llamar a la función para abrir el modal
          />
        </div>

        <SiteModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Sitios</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && sitiosData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={4} // Número de columnas que deseas mostrar (ajustar a los campos de sitio)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditSite} // Función para editar
                onDelete={handleDeleteSite} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay sitios para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default SitiosPage;
