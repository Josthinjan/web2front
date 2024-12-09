//pagina de etiquetas

"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';
import Label from "@/components/ui/label/Label";
import { useTagModal } from "@/hooks/modals/useTagModal";
import TagModal from "@/components/ui/modals/TagModal";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table

// Los tags de ejemplo
const tags = [
  { id: 1, name: 'Electrónica', color: '#0000FF', prioridad: 'Alta' },
  { id: 2, name: 'Informática', color: '#008000', prioridad: 'Media' },
  { id: 3, name: 'Salud', color: '#FF0000', prioridad: 'Inactivo' },
  { id: 4, name: 'Hogar', color: '#800080', prioridad: 'Activo' },
  { id: 5, name: 'Deportes', color: '#FFA500', prioridad: 'Activo' },
  { id: 6, name: 'Moda', color: '#FFC0CB', prioridad: 'Inactivo' },
  { id: 7, name: 'Educación', color: '#FFFF00', prioridad: 'Activo' },
  { id: 8, name: 'Arte', color: '#A52A2A', prioridad: 'Activo' },
  { id: 9, name: 'Cultura', color: '#808080', prioridad: 'Inactivo' },
  { id: 10, name: 'Viajes', color: '#00FFFF', prioridad: 'Activo' }
];

// Función para enviar datos de la etiqueta
const submitEtiquetaData = async (etiquetaData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/etiquetas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(etiquetaData),
  });
  if (!response.ok) {
    throw new Error('Error al enviar los datos de la etiqueta');
  }
  return response.json();
};

const EtiquetasPage = () => {
  const tagModal = useTagModal();
  const [etiquetas, setEtiquetas] = useState<any[]>(tags);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [showCreateLabelForm, setShowCreateLabelForm] = useState<boolean>(false);

  // Obtener datos de paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return etiquetas.slice(startIndex, endIndex);
  };

  // Mostrar formulario de nueva etiqueta
  const handleAddNewLabel = () => {
    setShowCreateLabelForm(true);
    tagModal.onOpen(); // Abre el modal al añadir nueva etiqueta
  };

  // Enviar datos de la etiqueta al backend
  const handleSubmitEtiqueta = async (etiquetaData: any) => {
    try {
      const response = await submitEtiquetaData(etiquetaData);
      if (response && response.message) {
        const nuevaEtiqueta = response.etiqueta;
        if (nuevaEtiqueta && nuevaEtiqueta.id_etiqueta) {
          setEtiquetas([...etiquetas, nuevaEtiqueta]);
          setShowCreateLabelForm(false);
          Swal.fire("Éxito", response.message, "success");
          tagModal.onClose(); // Cierra el modal después de crear la etiqueta
        } else {
          Swal.fire("Error", "No se pudo crear la etiqueta correctamente.", "error");
        }
      } else {
        Swal.fire("Error", "No se recibió una respuesta válida del servidor.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al crear la etiqueta", "error");
    }
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar etiqueta
  const handleDeleteTag = (id: number) => {
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
          // Aquí llamas al servicio para eliminar la etiqueta
          setEtiquetas(etiquetas.filter(tag => tag.id !== id)); // Elimina de la lista local
          Swal.fire("Eliminado", "Etiqueta eliminada correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar la etiqueta", "error");
        }
      }
    });
  };

  // Editar etiqueta
  const handleEditTag = (tag: any) => {
    tagModal.onOpen(tag); // Abre el modal con los datos de la etiqueta a editar
  };

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
            onClick={handleAddNewLabel} // Llamar a la función para abrir el modal
          />
        </div>
        <TagModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Etiquetas Disponibles</h2>
          {loading && <Label type="info" text="Cargando etiquetas" />}
          {error && <Label type="error" text={error} />}
          
          {!loading && !error && etiquetas.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={4}
                rowsPerPage={5}
                onEdit={handleEditTag} // Función para editar
                onDelete={handleDeleteTag} // Función para eliminar
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
            !loading && <Label type="info" text="No hay etiquetas para mostrar." />
          )}
        </div>
      </div>
    </main>
  );
};

export default EtiquetasPage;
