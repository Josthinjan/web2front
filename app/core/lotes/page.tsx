"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { useLoteModal } from "@/hooks/modals/useLoteModal"; // Asume que tienes un hook para el modal de lote
import LoteModal from "@/components/ui/modals/LoteModal"; // Asume que tienes el modal de lote
import { useFetch } from "@/hooks/useFetch";
import Table from "@/components/shared/Table/Table";
import Label from "@/components/ui/label/Label";

const LotesPage = () => {
  const loteModal = useLoteModal(); // Hook del modal de lote
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false); // Estado para controlar el refetch

  // Hook de fetch para obtener los lotes
  const { data: lotes, error, loading, refetch } = useFetch({ url: "/lotes" });

  // Cargar los lotes de la API
  useEffect(() => {
    if (lotes) {
      console.log("Datos recibidos de la API:", lotes);
    }
  }, [lotes]);

  useEffect(() => {
    if (error) {
      console.error("Error al obtener los lotes:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      console.log("Cargando lotes...");
    }
  }, [loading]);

  const handleAddNewLote = () => {
    loteModal.onOpen();
  };

  const handleDeleteLote = async (id_lote: number | string) => {
    console.log("ID del lote a eliminar:", id_lote);  // Verifica que el ID esté llegando correctamente
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

          const response = await fetch(`${config.API_BASE_URL}/lotes/${id_lote}`, {
            method: "DELETE",
            headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Lote eliminado correctamente", "success");

          // Marcar que necesitamos refetch de los datos
          setShouldRefetch(true);
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el lote", "error");
        }
      }
    });
  };


  // Manejar mostrar código de barras
  const handleShowBarcode = async (id: string | number) => {
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

      // Realizar el fetch a la API para obtener el código de barras
      const response = await fetch(`${config.API_BASE_URL}/lote/${id}/barcode`, {
        method: "GET", // Puede ser GET o POST, dependiendo de la API
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Error ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Mostrar el código de barras de alguna manera (por ejemplo, generando una imagen)
      Swal.fire({
        title: "Código de Barras",
        html: `
        <img src="${imageUrl}" alt="Código de Barras" id="barcodeImage" style="width: 100%; height: auto;" />
        <button id="printButton" style="margin-top: 10px;">Imprimir</button>
      `,
        icon: "info",
        showConfirmButton: false,
      });

      // Agregar evento de impresión al botón
      document.getElementById("printButton")?.addEventListener("click", () => {
        const printWindow = window.open("", "_blank");
        printWindow?.document.write(`<img src="${imageUrl}" alt="Código de Barras" style="width: 100%; height: auto;" />`);
        printWindow?.document.close();
        printWindow?.print();
      });

    } catch (error: any) {
      Swal.fire("Error", error.message || "Ocurrió un problema al obtener el código de barras", "error");
    }
  };


  const handleEditLote = (lote: any) => {
    loteModal.onOpen(lote);
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
          <h1 className="text-2xl font-bold">Administración de Lotes</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Lote"
            type="button"
            variant="primary"
            onClick={handleAddNewLote}
          />
        </div>
        <LoteModal setShouldRefetch={setShouldRefetch} />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Lotes Disponibles</h2>
          {loading && <Label type="info" text="Cargando lotes..." />}
          {error && <Label type="error" text="Error al cargar los datos." />}
          {!loading && !error && lotes && lotes.length === 0 && (
            <Label type="info" text="No hay lotes para mostrar." />
          )}
          {!loading && !error && lotes && lotes.length > 0 && (
            <Table
              data={lotes}
              columns={6}
              rowsPerPage={5}
              onEdit={handleEditLote}
              onDelete={(id) => {
                console.log("ID que se pasa a onDelete:", id); // Verifica el id aquí
                handleDeleteLote(id);
              }}
              idField="id_lote" // Especificamos el campo id_lote
              onShowBarcode={handleShowBarcode} // Pasamos la función aquí

            />
          )}
        </div>
      </div>
    </main>
  );
};

export default LotesPage;
