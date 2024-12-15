"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table";
import LoteModal from "@/components/ui/modals/LoteModal";
import { useLoteModal } from "@/hooks/modals/useLoteModal";
import { useFetch } from "@/hooks/useFetch";
import { config } from "@/config/config";

const LotesPage = () => {
  const loteModal = useLoteModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const rowsPerPage = 5;

  const { data: responseData, loading, error, refetch } = useFetch({ url: "/lotes" });
  const lotes = responseData?.data || [];

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return lotes.slice(startIndex, endIndex);
  };

  const handleAddNewLabel = () => {
    loteModal.onOpen();
  };

  const handleDeleteLote = async (id: number | string) => {
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
          const token = sessionStorage.getItem("token") || document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
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

          const response = await fetch(`${config.API_BASE_URL}/lotes/${id}`, { method: "DELETE", headers });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Lote eliminado correctamente", "success");
          setShouldRefetch(true);
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el lote", "error");
        }
      }
    });
  };

  const handleEditLote = (lote: any) => {
    loteModal.onOpen(lote);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (lotes) {
      const pages = Math.ceil(lotes.length / rowsPerPage);
      setTotalPages(pages);
    }
  }, [lotes, rowsPerPage]);

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, refetch]);

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
            onClick={handleAddNewLabel}
          />
        </div>
        <LoteModal setShouldRefetch={setShouldRefetch} />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Lotes</h2>
          {loading && <p className="text-gray-500">Cargando lotes...</p>}
          {error && <p className="text-red-500">Error al cargar los datos.</p>}

          {!loading && !error && lotes.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={7}
                rowsPerPage={rowsPerPage}
                onEdit={handleEditLote}
                onDelete={handleDeleteLote}
              />
              <div className="flex justify-between mt-4 w-full">
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
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
