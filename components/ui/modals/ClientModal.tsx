"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useClientModal } from "@/hooks/modals/useClientModal";
import { IClient } from "@/interfaces/IClient";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import Button from "@/components/shared/Button/Button";

const ClientModal = () => {
  const clientModal = useClientModal(); // Usamos el hook de zustand para manejar el estado
  const [formData, setFormData] = useState<IClient>({
    name: "",
    email: "",
    status: "Activo",
  });

  // Si clientToEdit está presente, pre-cargamos los valores del formulario
  useEffect(() => {
    // Si estamos editando, precargamos los valores del cliente
    if (clientModal.clientToEdit) {
      setFormData({
        name: clientModal.clientToEdit.name,
        email: clientModal.clientToEdit.email,
        status: clientModal.clientToEdit.status,
      });
    } else {
      // Si estamos creando, reiniciamos el formulario
      setFormData({
        name: "",
        email: "",
        status: "Activo",
      });
    }
  }, [clientModal.clientToEdit]); // Dependemos de clientToEdit para detectar cambios

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.name && formData.email && formData.status) {
      // Aquí iría la lógica para guardar o actualizar el cliente, por ejemplo
      console.log("Cliente creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (clientModal.clientToEdit) {
        // Lógica para actualizar el cliente
        console.log("Editando cliente:", formData);
      } else {
        // Lógica para crear el cliente
        console.log("Creando nuevo cliente:", formData);
      }

      clientModal.onClose(); // Cerrar el modal después de crear o actualizar el cliente
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clientModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del cliente"
        name="name"
        idInput="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Correo electrónico"
        name="email"
        idInput="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
      />
      <FormSelectInput
        label="Estado"
        selectName="status"
        selectId="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: "Activo", name: "Activo" },
          { value: "Inactivo", name: "Inactivo" },
        ]}
      />
      <div>
        <Button
          type="submit"
          variant="primary"
          label={clientModal.clientToEdit ? "Actualizar Cliente" : "Crear Cliente"}
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={clientModal.isOpen}
      onClose={clientModal.onClose}
      title={clientModal.clientToEdit ? "Editar Cliente" : "Crear Cliente"}
      body={clientModalBody}
    />
  );
};

export default ClientModal;
