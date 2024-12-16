"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { useUserModal } from "@/hooks/modals/useUserModal";
import UserModal from "@/components/ui/modals/UserModal";
import { useFetch } from "@/hooks/useFetch";
import Table from "@/components/shared/Table/Table";
import Label from "@/components/ui/label/Label";

const UsuariosPage = () => {
  const userModal = useUserModal();
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);  // Estado para almacenar usuarios
  const [pagination, setPagination] = useState<any>({}); // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual

  // Hook de fetch para obtener los usuarios
  const { data, error, loading, refetch } = useFetch({
    url: `/usuarios?page=${currentPage}`, // Incluir la página en la URL
  });

  // Cargar los usuarios de la API
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setUsuarios(data.data);  // Extraer solo los datos de los usuarios
      setPagination({
        total: data.total,
        perPage: data.per_page,
        currentPage: data.current_page,
        lastPage: data.last_page,
      });
    } else {
      setUsuarios([]);  // Asegurarse de que usuarios sea un array vacío si no hay datos
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      console.log("Cargando usuarios...");
    }
  }, [loading]);

  const handleAddNewUser = () => {
    userModal.onOpen();
  };

  const handleDeleteUser = async (id_usuario: number | string) => {
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

          const tenant = sessionStorage.getItem("X_Tenant"); // Aquí recuperas el tenant

          if (!tenant) {
            Swal.fire("Error", "El tenant no está especificado", "error");
            return;
          }

          const tenantDatabase = tenant; // Este campo debe ser el nombre de la base de datos o identificador de tenant, verifica si es necesario
          
          const headers: HeadersInit = {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "X-Tenant": tenant,
            "tenant_database": tenantDatabase, // Agregar aquí el tenant_database
          };

          const response = await fetch(`${config.API_BASE_URL}/usuarios/${id_usuario}`, {
            method: "DELETE",
            headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Error ${response.status}`);
          }

          Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");

          setShouldRefetch(true);  // Indicar que se debe hacer un refetch
        } catch (err: any) {
          Swal.fire("Error", err.message || "Ocurrió un problema al eliminar el usuario", "error");
        }
      }
    });
  };

  const handleEditUser = (user: any) => {
    userModal.onOpen(user);
    setShouldRefetch(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);  // Actualizar la página cuando se navegue
  };

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
          <h1 className="text-2xl font-bold">Administración de Usuarios</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Usuario"
            type="button"
            variant="primary"
            onClick={handleAddNewUser}
          />
        </div>
        <UserModal setShouldRefetch={setShouldRefetch} />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Usuarios</h2>
          {loading && <Label type="info" text="Cargando usuarios..." />}
          {error && <Label type="error" text="Error al cargar los datos." />}
          {!loading && !error && usuarios.length === 0 && (
            <Label type="info" text="No hay usuarios para mostrar." />
          )}
          {!loading && !error && usuarios.length > 0 && (
            <Table
              data={usuarios}
              columns={6}
              rowsPerPage={pagination.perPage}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              idField="id"
            />
          )}
          {/* Agregar controles de paginación */}
          {pagination.total > pagination.perPage && (
            <div className="flex justify-between items-center mt-4">
              <Button
                label="Anterior"
                type="button"
                variant="secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              <span>
                Página {currentPage} de {pagination.lastPage}
              </span>
              <Button
                label="Siguiente"
                type="button"
                variant="secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.lastPage}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UsuariosPage;