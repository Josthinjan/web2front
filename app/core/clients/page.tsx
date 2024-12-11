"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Label from "@/components/ui/label/Label";
import { useClientModal } from "@/hooks/modals/useClientModal";
import ClientModal from "@/components/ui/modals/ClientModal";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table

// Los clients de ejemplo
const clients = [
  { id: 1, name: 'Juan Pérez', email: 'juan@correo.com', status: 'Activo' },
  { id: 2, name: 'María López', email: 'maria@correo.com', status: 'Inactivo' },
  { id: 3, name: 'Carlos García', email: 'carlos@correo.com', status: 'Activo' },
  { id: 4, name: 'Laura Rodríguez', email: 'laura@correo.com', status: 'Inactivo' },
  { id: 5, name: 'Pedro Martínez', email: 'pedro@correo.com', status: 'Activo' },
  { id: 6, name: 'Ana Fernández', email: 'ana@correo.com', status: 'Activo' },
  { id: 7, name: 'Luis Sánchez', email: 'luis@correo.com', status: 'Inactivo' },
  { id: 8, name: 'Sofia Ramírez', email: 'sofia@correo.com', status: 'Activo' },
  { id: 9, name: 'Jorge Díaz', email: 'jorge@correo.com', status: 'Activo' },
  { id: 10, name: 'Elena Álvarez', email: 'elena@correo.com', status: 'Inactivo' },
];

// Función para enviar datos del cliente
const submitClientData = async (clientData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) {
    throw new Error("Error al enviar los datos del cliente");
  }
  return response.json();
};

const ClientsPage = () => {
  const clientModal = useClientModal();
  const [clientsList, setClientsList] = useState<any[]>(clients);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [showCreateClientForm, setShowCreateClientForm] = useState<boolean>(false);

  // Obtener datos de paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return clientsList.slice(startIndex, endIndex);
  };

  // Mostrar formulario de nuevo cliente
  const handleAddNewClient = () => {
    setShowCreateClientForm(true);
    clientModal.onOpen(); // Abre el modal al añadir nuevo cliente
  };

  // Enviar datos del cliente al backend
  const handleSubmitClient = async (clientData: any) => {
    try {
      const response = await submitClientData(clientData);
      if (response && response.message) {
        const newClient = response.client;
        if (newClient && newClient.id) {
          setClientsList([...clientsList, newClient]);
          setShowCreateClientForm(false);
          Swal.fire("Éxito", response.message, "success");
          clientModal.onClose(); // Cierra el modal después de crear el cliente
        } else {
          Swal.fire("Error", "No se pudo crear el cliente correctamente.", "error");
        }
      } else {
        Swal.fire("Error", "No se recibió una respuesta válida del servidor.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al crear el cliente", "error");
    }
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar cliente
  const handleDeleteClient = (id: number) => {
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
          // Aquí llamas al servicio para eliminar el cliente
          setClientsList(clientsList.filter(client => client.id !== id)); // Elimina de la lista local
          Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el cliente", "error");
        }
      }
    });
  };

  // Editar cliente
  const handleEditClient = (client: any) => {
    clientModal.onOpen(client); // Abre el modal con los datos del cliente a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Clientes</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Cliente"
            type="button"
            variant="primary"
            onClick={handleAddNewClient} // Llamar a la función para abrir el modal
          />
        </div>
        <ClientModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Clientes Disponibles</h2>
          {loading && <Label type="info" text="Cargando clientes" />}
          {error && <Label type="error" text={error} />}
          
          {!loading && !error && clientsList.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={4}
                rowsPerPage={5}
                onEdit={handleEditClient} // Función para editar
                onDelete={handleDeleteClient} // Función para eliminar
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
            !loading && <Label type="info" text="No hay clientes para mostrar." />
          )}
        </div>
      </div>
    </main>
  );
};

export default ClientsPage;
