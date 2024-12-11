"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import RoleModal from "@/components/ui/modals/RoleModal"; // Importa el modal
import { useRoleModal } from "@/hooks/modals/useRoleModal"; // Importa el hook para manejar el modal
import { IRole } from "@/interfaces/IRole"; // Importa la interfaz de rol

// Datos de ejemplo de roles
const roles: IRole[] = [
  { id: 1, name: "Administrador", description: "Acceso total al sistema", permissions: ["Crear", "Editar", "Eliminar", "Ver"] },
  { id: 2, name: "Editor", description: "Puede editar contenido", permissions: ["Editar", "Ver"] },
  { id: 3, name: "Viewer", description: "Solo puede ver contenido", permissions: ["Ver"] },
];

const RolesPage = () => {
  const roleModal = useRoleModal();
  const [rolesData, setRolesData] = useState<IRole[]>(roles);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;
  const [showCreateLabelForm, setShowCreateLabelForm] = useState<boolean>(false);

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(rolesData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [rolesData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rolesData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar rol
  const handleDeleteRole = (id: string | number) => {
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
          setRolesData(rolesData.filter(role => role.id !== id));
          Swal.fire("Eliminado", "Rol eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el rol", "error");
        }
      }
    });
  };

  const handleAddNewRole = () => {
    setShowCreateLabelForm(true);
    roleModal.onOpen(); // Abre el modal al añadir nuevo rol
  };

  // Editar rol
  const handleEditRole = (role: IRole) => {
    roleModal.onOpen(role); // Abre el modal con los datos del rol a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Roles y Permisos</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Rol"
            type="button"
            variant="primary"
            onClick={handleAddNewRole} // Llamar a la función para abrir el modal
          />
        </div>
        
        <RoleModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Roles</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && rolesData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={4} // Número de columnas (id, name, description, permissions)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditRole} // Función para editar
                onDelete={handleDeleteRole} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay roles para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default RolesPage;
