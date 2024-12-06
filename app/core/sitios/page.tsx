"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';
import Label from "@/components/ui/label/Label";
import useSitesModal from "@/hooks/modals/useSitesModal";
import SitesModal from "@/components/ui/modals/SitesModal";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table

// Datos de ejemplo (quemados)
const sitesData = [
  { id: 1, name: "Bodega A", address: "Calle Ficticia 123", city: "Ciudad A", country: "País A" },
  { id: 2, name: "Bodega B", address: "Avenida Imaginaria 456", city: "Ciudad B", country: "País B" },
  { id: 3, name: "Bodega C", address: "Plaza Ejemplo 789", city: "Ciudad C", country: "País C" },
  { id: 4, name: "Bodega D", address: "Calle Real 101", city: "Ciudad D", country: "País D" },
  { id: 5, name: "Bodega E", address: "Avenida Central 202", city: "Ciudad E", country: "País E" },
];

// Función para enviar datos del sitio
const submitSiteData = async (siteData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/sites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(siteData),
  });
  if (!response.ok) {
    throw new Error('Error al enviar los datos del sitio');
  }
  return response.json();
};

const SitesPage = () => {
  const siteModal = useSitesModal();
  const [sites, setSites] = useState<any[]>(sitesData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [showCreateSiteForm, setShowCreateSiteForm] = useState<boolean>(false);

  // Obtener datos de paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * 3;
    const endIndex = startIndex + 3;
    return sites.slice(startIndex, endIndex);
  };

  // Mostrar formulario de nueva bodega
  const handleAddNewSite = () => {
    setShowCreateSiteForm(true);
    siteModal.onOpen(); // Abre el modal al añadir nueva bodega
  };

  // Enviar datos del sitio al backend
  const handleSubmitSite = async (siteData: any) => {
    try {
      const response = await submitSiteData(siteData);
      if (response && response.message) {
        const newSite = response.site;
        if (newSite && newSite.id) {
          setSites([...sites, newSite]);
          setShowCreateSiteForm(false);
          Swal.fire("Éxito", response.message, "success");
          siteModal.onClose(); // Cierra el modal después de crear el sitio
        } else {
          Swal.fire("Error", "No se pudo crear el sitio correctamente.", "error");
        }
      } else {
        Swal.fire("Error", "No se recibió una respuesta válida del servidor.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al crear el sitio", "error");
    }
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar sitio
  const handleDeleteSite = (id: number) => {
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
          // Aquí llamas al servicio para eliminar el sitio
          setSites(sites.filter(site => site.id !== id)); // Elimina de la lista local
          Swal.fire("Eliminado", "Bodega eliminada correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el sitio", "error");
        }
      }
    });
  };

  // Editar sitio
  const handleEditSite = (site: any) => {
    siteModal.onOpen(site); // Abre el modal con los datos del sitio a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Bodegas</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nueva Bodega"
            type="button"
            variant="primary"
            onClick={handleAddNewSite} // Llamar a la función para abrir el modal
          />
        </div>
        <SitesModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Bodegas Disponibles</h2>
          {loading && <Label type="info" text="Cargando bodegas" />}
          {error && <Label type="error" text={error} />}
          
          {!loading && !error && sites.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={4}
                rowsPerPage={3}
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
            !loading && <Label type="info" text="No hay bodegas para mostrar." />
          )}
        </div>
      </div>
    </main>
  );
};

export default SitesPage;
