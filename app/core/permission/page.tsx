"use client";
import Table from "@/components/shared/Table/Table";
import Label from "@/components/ui/label/Label";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import { useFetch } from "@/hooks/useFetch";
import React, { useState } from "react";
import Button from "@/components/shared/Button/Button";


const Page = () => {

  const rolesData = [
    {
      id: "1",
      name: "Administrador",
      description: "Acceso completo a todas las funcionalidades del sistema",
      permissions: [
        "Crear Artículos ",
        "Editar Artículos ",
        "Eliminar Artículos ",
        "Acceder a Configuración ",
      ],
    },
    {
      id: "2",
      name: "Editor",
      description: "Puede editar contenido, pero no tiene acceso a la configuración",
      permissions: [
        "Crear Artículos ",
        "Editar Artículos ",
      ],
    },
    {
      id: "3",
      name: "Usuario",
      description: "Acceso limitado a funcionalidades básicas, como leer contenido",
      permissions: [
        "Leer Artículos ",
      ],
    },
  ];
  
  // Permisos
  const permissionsData = [
    {
      id: "1",
      name: "Crear Artículos",
      description: "Permite a los usuarios crear nuevos artículos en el sistema",
    },
    {
      id: "2",
      name: "Editar Artículos",
      description: "Permite a los usuarios editar artículos existentes",
    },
    {
      id: "3",
      name: "Eliminar Artículos",
      description: "Permite a los usuarios eliminar artículos",
    },
    {
      id: "4",
      name: "Acceder a Configuración",
      description: "Permite a los usuarios acceder y modificar la configuración del sistema",
    },
  ];
  
  const { data: roles, error: rolesError, loading: rolesLoading } = useFetch({
    url: "/api/roles",
  });

  const { data: permissions, error: permissionsError, loading: permissionsLoading } = useFetch({
    url: "/api/permissions",
  });

  const { data: users, error: usersError, loading: usersLoading } = useFetch({
    url: "/api/users",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Número de filas por página
  const totalPages = Math.max(1, Math.ceil(rolesData.length / rowsPerPage));

  const handleEditProduct = (product: Record<string, any>) => {
    console.log("Edit product:", product);
  };

  const handleDeleteProduct = (id: number) => {
    console.log("Delete product with ID:", id);
  };

  const getPaginatedData = () => {
    return rolesData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <main className="flex justify-start items-start p-0 m-0 w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-start h-full p-3">
        {rolesError && <Label type="error" text="Error al cargar los roles" />}
        {rolesLoading && <Label type="info" text="Cargando roles..." />}
        {permissionsError && <Label type="error" text="Error al cargar los permisos" />}
        {permissionsLoading && <Label type="info" text="Cargando permisos..." />}
        {usersError && <Label type="error" text="Error al cargar los usuarios" />}
        {usersLoading && <Label type="info" text="Cargando usuarios..." />}
        <h1 className="text-2xl font-bold text-gray-800">
          Roles y Permisos
        </h1>
        <Button
            label="Añadir Nuevo Producto"
            type="button"
            variant="primary"
            onClick={() => console.log("Añadir nuevo producto")}
          />
        <div>
        <Table
              data={getPaginatedData()}
              columns={5}
              rowsPerPage={rowsPerPage}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
        </div>
        {/* Paginación */}
        <div className="flex justify-between mt-4 w-full">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="font-semibold">{currentPage} / {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
      </div>
    </main>
  );
};

export default Page;
