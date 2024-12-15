'use client';
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; 
import ProviderModal from "@/components/ui/modals/ProviderModal"; 
import { useProviderModal } from "@/hooks/modals/useProviderModal"; 
import { useFetch } from "@/hooks/useFetch"; 
import { config } from "@/config/config"; // Ajusta si el config tiene el API base
import { IProvider } from "@/interfaces/IProvider";

const ProveedoresPage = () => {
  const providerModal = useProviderModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  const { data: proveedoresData, loading, error, refetch } = useFetch<IProvider[]>({
    url: "/proveedores",
  });

  const proveedores = proveedoresData || [];

  useEffect(() => {
    const totalPagesCalculated = Math.ceil(proveedores.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [proveedores]);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return proveedores.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteProvider = (id: number | string) => {
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

          const response = await fetch(`${config.API_BASE_URL}/proveedores/${id}`, {
            method: "DELETE",
            headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Proveedor eliminado correctamente", "success");

          refetch();  // Refrescar la lista después de eliminar
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el proveedor", "error");
        }
      }
    });
  };

  const handleAddNewProvider = () => {
    providerModal.onOpen();
  };

  const handleEditProvider = (provider: IProvider) => {
    providerModal.onOpen(provider); 
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
            onClick={handleAddNewProvider} 
          />
        </div>
        
        <ProviderModal setShouldRefetch={refetch} />
        
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Proveedores</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error?.message}</p>}

          {!loading && !error && proveedores.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={6}  // Ajusta el número de columnas según los campos de tu interfaz
                rowsPerPage={rowsPerPage}
                onEdit={handleEditProvider} 
                onDelete={handleDeleteProvider} 
              />
              <div className="flex justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          ) : (
            <p>No hay proveedores registrados.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProveedoresPage;
