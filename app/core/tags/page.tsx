"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { useTagModal } from "@/hooks/modals/useTagModal";
import TagModal from "@/components/ui/modals/TagModal";
import { useFetch } from "@/hooks/useFetch";
import Table from "@/components/shared/Table/Table";
import Label from "@/components/ui/label/Label";

const EtiquetasPage = () => {
  const tagModal = useTagModal();
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false); // Estado para controlar el refetch

  // Hook de fetch para obtener las etiquetas
  const { data: etiquetas, error, loading, refetch } = useFetch({ url: "/etiquetas" });

  // Cargar las etiquetas de la API
  useEffect(() => {
    if (etiquetas) {
      console.log("Datos recibidos de la API:", etiquetas);
    }
  }, [etiquetas]);

  useEffect(() => {
    if (error) {
      console.error("Error al obtener las etiquetas:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      console.log("Cargando etiquetas...");
    }
  }, [loading]);

  const handleAddNewLabel = () => {
    tagModal.onOpen();
  };

  const handleDeleteTag = async (id_etiqueta: number | string) => {
    console.log("ID de la etiqueta a eliminar:", id_etiqueta);  // Verifica que el ID esté llegando correctamente
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
  
          const response = await fetch(`${config.API_BASE_URL}/etiquetas/${id_etiqueta}`, {
            method: "DELETE",
            headers,
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }
  
          Swal.fire("Eliminado", "Etiqueta eliminada correctamente", "success");
  
          // Marcar que necesitamos refetch de los datos
          setShouldRefetch(true);
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar la etiqueta", "error");
        }
      }
    });
  };

  const handleEditTag = (tag: any) => {
    tagModal.onOpen(tag);
    // Marcar que necesitamos refetch de los datos después de editar
    setShouldRefetch(true);
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
          <h1 className="text-2xl font-bold">Administración de Etiquetas</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nueva Etiqueta"
            type="button"
            variant="primary"
            onClick={handleAddNewLabel}
          />
        </div>
        <TagModal setShouldRefetch={setShouldRefetch} />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Etiquetas Disponibles</h2>
          {loading && <Label type="info" text="Cargando etiquetas..." />}
          {error && <Label type="error" text="Error al cargar los datos." />}
          {!loading && !error && etiquetas && etiquetas.length === 0 && (
            <Label type="info" text="No hay etiquetas para mostrar." />
          )}
          {!loading && !error && etiquetas && etiquetas.length > 0 && (
            <Table
              data={etiquetas}
              columns={6}
              rowsPerPage={5}
              onEdit={handleEditTag}
              onDelete={(id) => {
                console.log("ID que se pasa a onDelete:", id); // Verifica el id aquí
                handleDeleteTag(id);
              }} 
              idField="id_etiqueta"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default EtiquetasPage;
