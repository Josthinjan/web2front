"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { useSitesModal } from "@/hooks/modals/useSitesModal";
import SitesModal from "@/components/ui/modals/SitesModal";

import Table from "@/components/shared/Table/Table";
import { useFetch } from "@/hooks/useFetch";
import Label from "@/components/ui/label/Label";

const SitesPage = () => {
  const siteModal = useSitesModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showCreateSiteForm, setShowCreateSiteForm] = useState<boolean>(false);

  const { data: responseData, error, loading, refetch } = useFetch({ url: "/sitios" });

  const sites = responseData?.data || [];

  const rowsPerPage = 5;

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sites.slice(startIndex, endIndex);
  };

  const handleAddNewSite = () => {
    setShowCreateSiteForm(true);
    siteModal.onOpen();
  };

  const handleDeleteSite = async (id: number | string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = sessionStorage.getItem("token") ||
            document.cookie.split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1];

          const tenant = sessionStorage.getItem("X_Tenant");

          if (!tenant) {
            Swal.fire("Error", "El tenant no está especificado", "error");
            return;
          }

          const headers: HeadersInit = {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "X-Tenant": tenant, 
          };

          const response = await fetch(`${config.API_BASE_URL}/sitios/${id}`, {
            method: "DELETE",
            headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Sitio eliminado correctamente", "success");
          refetch();
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el sitio", "error");
        }
      }
    });
  };

  const handleEditSite = (site: any) => {
    siteModal.onOpen(site);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (sites) {
      const pages = Math.ceil(sites.length / rowsPerPage);
      setTotalPages(pages);
    }
  }, [sites, rowsPerPage]);

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
            onClick={handleAddNewSite}
          />
        </div>
        <SitesModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Bodegas Disponibles</h2>
          {loading && <Label type="info" text="Cargando bodegas..." />}
          {error && <Label type="error" text="Error al cargar los datos." />}

          {!loading && !error && sites.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={5}
                rowsPerPage={rowsPerPage}
                onEdit={handleEditSite}
                onDelete={handleDeleteSite}
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
