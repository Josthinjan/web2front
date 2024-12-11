"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useProviderModal } from "@/hooks/modals/useProviderModal"; // Hook para manejar el estado del modal
import { IProvider } from "@/interfaces/IProvider"; // Interfaz del proveedor
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import Button from "@/components/shared/Button/Button";

const ProviderModal = () => {
  const providerModal = useProviderModal(); // Usamos el hook para el estado del modal
  const [formData, setFormData] = useState<IProvider>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    active: true, // Estado por defecto
  });

  // Si providerToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (providerModal.providerToEdit) {
      setFormData({
        name: providerModal.providerToEdit.name,
        email: providerModal.providerToEdit.email,
        phone: providerModal.providerToEdit.phone,
        address: providerModal.providerToEdit.address,
        city: providerModal.providerToEdit.city,
        active: providerModal.providerToEdit.active,
      });
    } else {
      // Limpiar los datos cuando no se está editando
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        active: true,
      });
    }
  }, [providerModal.providerToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.address &&
      formData.city
    ) {
      // Lógica para guardar o actualizar el proveedor
      console.log("Proveedor creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (providerModal.providerToEdit) {
        // Lógica para actualizar el proveedor
        console.log("Editando proveedor:", formData);
      } else {
        // Lógica para crear el proveedor
        console.log("Creando nuevo proveedor:", formData);
      }

      providerModal.onClose(); // Cerrar el modal después de crear o actualizar el proveedor
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

  const providerModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Proveedor"
        name="name"
        idInput="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Correo Electrónico"
        name="email"
        idInput="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
      />
      <FormInput
        label="Teléfono"
        name="phone"
        idInput="phone"
        value={formData.phone}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Dirección"
        name="address"
        idInput="address"
        value={formData.address}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Ciudad"
        name="city"
        idInput="city"
        value={formData.city}
        onChange={handleChange}
        type="text"
      />
      <FormSelectInput
        label="¿Está Activo?"
        selectName="active"
        selectId="active"
        value={formData.active ? "true" : "false"}
        onChange={handleChange}
        options={[
          { value: "true", name: "Sí" },
          { value: "false", name: "No" },
        ]}
      />
      <div>
        <Button type="submit" variant="primary" label={providerModal.providerToEdit ? "Actualizar Proveedor" : "Crear Proveedor"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={providerModal.isOpen}
      onClose={providerModal.onClose}
      title={providerModal.providerToEdit ? "Editar Proveedor" : "Crear Proveedor"}
      body={providerModalBody}
    />
  );
};

export default ProviderModal;
