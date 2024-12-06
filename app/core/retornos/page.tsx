"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Label from "@/components/ui/label/Label";
import Table from "@/components/shared/Table/Table"; // Tabla para mostrar los retornos

// Datos de ejemplo
const data = [
  {
    fechaRetorno: "2024-11-25",
    codigoLote: "A123456",
    nombreUsuario: "Juan Pérez",
    nombreProducto: "Laptop Dell XPS 13",
    cantidad: 1,
    motivoRetorno: "Defecto en la pantalla",
    estado: "Procesado",
  },
  {
    fechaRetorno: "2024-11-26",
    codigoLote: "B654321",
    nombreUsuario: "María López",
    nombreProducto: "Smartphone Samsung Galaxy S23",
    cantidad: 2,
    motivoRetorno: "Pantalla rota",
    estado: "Pendiente",
  },
  {
    fechaRetorno: "2024-11-27",
    codigoLote: "C112233",
    nombreUsuario: "Carlos Martínez",
    nombreProducto: "Auriculares Bose QC45",
    cantidad: 1,
    motivoRetorno: "Sonido defectuoso",
    estado: "En revisión",
  },
  {
    fechaRetorno: "2024-11-28",
    codigoLote: "D445566",
    nombreUsuario: "Ana García",
    nombreProducto: "Monitor LG 27UL850-W",
    cantidad: 1,
    motivoRetorno: "No enciende",
    estado: "Rechazado",
  },
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
    codigoLote: "F998877",
    nombreUsuario: "Luisa Fernández",
    nombreProducto: "Mouse inalámbrico Razer Viper",
    cantidad: 1,
    motivoRetorno: "Fallo de conexión",
    estado: "Pendiente",
  }
];

const RetornosPage = () => {
  const [retornos, setRetornos] = useState<any[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Obtener datos de la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return retornos.slice(startIndex, endIndex);
  };

  // Enviar datos de retorno al backend (función de ejemplo)
  const handleSubmitReturn = async (returnData: any) => {
    const token = getTokenFromCookie();
    const response = await fetch(`${config.API_BASE_URL}/retornos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(returnData),
    });

    if (!response.ok) {
      throw new Error("Error al enviar los datos del retorno");
    }

    const data = await response.json();
    return data;
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar retorno
  const handleDeleteReturn = (id: number) => {
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
          // Aquí llamas al servicio para eliminar el retorno
          setRetornos(retornos.filter((retorno) => retorno.codigoLote !== id)); // Elimina de la lista local
          Swal.fire("Eliminado", "Retorno eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el retorno", "error");
        }
      }
    });
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Retornos</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Retorno"
            type="button"
            variant="primary"
            // Aquí iría la lógica para abrir el modal de nuevo retorno
          />
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Retornos</h2>
          {loading && <Label type="info" text="Cargando retornos" />}
          {error && <Label type="error" text={error} />}
          
          {!loading && !error && retornos.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={7}
                rowsPerPage={5}
                onEdit={(id: number) => {
                  // Lógica para editar el retorno
                }} // Acción para editar
                onDelete={handleDeleteReturn} // Acción para eliminar
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
            !loading && <Label type="info" text="No hay retornos para mostrar." />
          )}
        </div>
      </div>
    </main>
  );
};

export default RetornosPage;
