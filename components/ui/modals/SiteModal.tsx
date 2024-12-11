"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useSiteModal } from "@/hooks/modals/useSiteModal"; // Hook para manejar el estado del modal
import { ISite } from "@/interfaces/ISite"; // Interfaz del sitio
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";

const SiteModal = () => {
  const siteModal = useSiteModal(); // Usamos el hook para el estado del modal
  const [formData, setFormData] = useState<ISite>({
    name: "",
    address: "",
    city: "",
    country: "",
  });

  // Si siteToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (siteModal.siteToEdit) {
      setFormData({
        name: siteModal.siteToEdit.name,
        address: siteModal.siteToEdit.address,
        city: siteModal.siteToEdit.city,
        country: siteModal.siteToEdit.country,
      });
    } else {
      // Limpiar los datos cuando no se está editando
      setFormData({
        name: "",
        address: "",
        city: "",
        country: "",
      });
    }
  }, [siteModal.siteToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formData.name &&
      formData.address &&
      formData.city &&
      formData.country
    ) {
      // Lógica para guardar o actualizar el sitio
      console.log("Sitio creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (siteModal.siteToEdit) {
        // Lógica para actualizar el sitio
        console.log("Editando sitio:", formData);
      } else {
        // Lógica para crear el sitio
        console.log("Creando nuevo sitio:", formData);
      }

      siteModal.onClose(); // Cerrar el modal después de crear o actualizar el sitio
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const siteModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Sitio"
        name="name"
        idInput="name"
        value={formData.name}
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
      <FormInput
        label="País"
        name="country"
        idInput="country"
        value={formData.country}
        onChange={handleChange}
        type="text"
      />
      <div>
        <Button type="submit" variant="primary" label={siteModal.siteToEdit ? "Actualizar Sitio" : "Crear Sitio"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={siteModal.isOpen}
      onClose={siteModal.onClose}
      title={siteModal.siteToEdit ? "Editar Sitio" : "Crear Sitio"}
      body={siteModalBody}
    />
  );
};

export default SiteModal;
