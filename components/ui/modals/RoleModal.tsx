"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useRoleModal } from "@/hooks/modals/useRoleModal"; // Hook para manejar el estado del modal
import { IRole } from "@/interfaces/IRole"; // Interfaz del rol
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";

const RoleModal = () => {
  const roleModal = useRoleModal(); // Usamos el hook de zustand para el estado del modal
  const [formData, setFormData] = useState<IRole>({
    id: 0,
    name: "",
    description: "",
    permissions: [],
  });

  // Si roleToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (roleModal.roleToEdit) {
      setFormData({
        id: roleModal.roleToEdit.id,
        name: roleModal.roleToEdit.name,
        description: roleModal.roleToEdit.description,
        permissions: roleModal.roleToEdit.permissions,
      });
    }
  }, [roleModal.roleToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formData.name &&
      formData.description &&
      formData.permissions.length > 0
    ) {
      // Lógica para guardar o actualizar el rol
      console.log("Rol creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (roleModal.roleToEdit) {
        // Lógica para actualizar el rol
        console.log("Editando rol:", formData);
      } else {
        // Lógica para crear el rol
        console.log("Creando nuevo rol:", formData);
      }

      roleModal.onClose(); // Cerrar el modal después de crear o actualizar el rol
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePermissionsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPermissions = Array.from(event.target.selectedOptions, option => option.value);
    setFormData((prevData) => ({
      ...prevData,
      permissions: selectedPermissions,
    }));
  };

  const roleModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Rol"
        name="name"
        idInput="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
      />
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
          Descripción del Rol
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="permissions" className="block text-sm font-semibold text-gray-700">
          Permisos
        </label>
        <select
          id="permissions"
          name="permissions"
          multiple
          value={formData.permissions}
          onChange={handlePermissionsChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="crear">Crear</option>
          <option value="editar">Editar</option>
          <option value="eliminar">Eliminar</option>
          <option value="ver">Ver</option>
        </select>
      </div>
      <div>
        <Button
          type="submit"
          variant="primary"
          label={roleModal.roleToEdit ? "Actualizar Rol" : "Crear Rol"}
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={roleModal.isOpen}
      onClose={roleModal.onClose}
      title={roleModal.roleToEdit ? "Editar Rol" : "Crear Rol"}
      body={roleModalBody}
    />
  );
};

export default RoleModal;
