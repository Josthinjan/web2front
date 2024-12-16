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
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false); // Estado para controlar el refetch
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Hook de fetch para obtener los proveedores
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

  const handleAddNewProvider = () => {
    providerModal.onOpen();
  };

  const handleDeleteProvider = async (id_proveedor: number | string) => {  // Cambié 'id' a 'id_proveedor'
    console.log("ID de proveedor a eliminar:", id_proveedor);  // Verifica que el ID esté llegando correctamente
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

          if (!id_proveedor) {
            throw new Error("ID del proveedor no encontrado");
          }

          const response = await fetch(`${config.API_BASE_URL}/proveedores/${id_proveedor}`, {  // Usa 'id_proveedor'
            method: "DELETE",
            headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Proveedor eliminado correctamente", "success");
          setShouldRefetch(true); // Refetch de los datos
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el proveedor", "error");
        }
      }
    });
  };

  const handleEditProvider = (provider: IProvider) => {
    providerModal.onOpen(provider);
  };

  // Refetch los datos cuando se haya marcado
  useEffect(() => {
    if (shouldRefetch) {
      refetch(); // Recargar los datos cuando se haya marcado
      setShouldRefetch(false); // Restablecer el estado
    }
  }, [shouldRefetch, refetch]);

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

        <ProviderModal setShouldRefetch={setShouldRefetch} />

        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Proveedores</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error?.message}</p>}

          {!loading && !error && proveedores.length > 0 ? (
            <>
              <Table
  data={proveedores}  // Datos de proveedores
  columns={5}
  rowsPerPage={5}
  onEdit={handleEditProvider}
  onDelete={handleDeleteProvider}
  idField="id_proveedor"  // Especificamos el campo id_proveedor
/>
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
