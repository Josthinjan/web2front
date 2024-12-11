"use client";

import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import { IUser } from "@/interfaces/IUser";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Label from "@/components/ui/label/Label";
import UserModal from "@/components/ui/modals/UserModal";
import { useUserModal, useUserEditModal } from "@/hooks/modals/useUserModal";
import Table from "@/components/shared/Table/Table";
import UserEditModal from "@/components/ui/modals/userEditModal";

const Page = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Filas por página

  const userModal = useUserModal();
  const userEditModal = useUserEditModal();
  const [formData, setFormData] = useState<IUser>({
    name: "",
    email: "",
    cellphone: "",
    role: "",
    identity: "",
    lastname: "",
  });

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useFetch({
    url: "/api/users",
  });

  // El estado se actualiza cuando los datos de usuario se carguen
  useEffect(() => {
    if (userData) {
      setUsers(userData);
    }
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para eliminar usuario
  const handleDelete = (id: number|string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  // Función para editar usuario
  const handleEdit = (user: IUser) => {
    userEditModal.onOpen(user); // Pasa el usuario completo
  };

  // Paginación
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedData = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="flex justify-center items-start w-full">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-start min-h-[calc(90vh-80px)] p-4">
        {userLoading && <Label type="info" text="Cargando usuarios" />}
        {userError && <Label type="error" text="Error al cargar usuarios" />}
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de usuarios</h1>
        </div>
        <div className="flex mb-4">
          <Button
            type="button"
            onClick={userModal.onOpen}
            variant="primary"
            label="Crear usuario"
          />
        </div>
        <UserModal />
        {/* Mostrar el modal de edición si está abierto */}
        {userEditModal.isOpen && userEditModal.userToEdit && (
          <UserEditModal
            userToEdit={userEditModal.userToEdit} // Pasar el usuario a editar
            onClose={userEditModal.onClose} // Función para cerrar el modal
          />
        )}
        {users.length > 0 ? (
          <>
            <Table
              data={paginatedData}
              columns={7}
              rowsPerPage={rowsPerPage}
              onDelete={handleDelete}
              onEdit={handleEdit}
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
          !userLoading && <Label type="info" text="No hay usuarios para mostrar." />
        )}
      </div>
    </main>
  );
};

export default Page;
