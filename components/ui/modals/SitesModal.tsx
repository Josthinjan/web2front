"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import useSitesModal from "@/hooks/modals/useSitesModal"; // Usamos el hook de zustand
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";

const SiteModal = () => {
  const siteModal = useSitesModal(); // Usamos el hook de zustand
  const [formData, setFormData] = useState({
    siteName: "",
    siteAddress: "",
    siteCity: "",
    siteCountry: "",
  });

  // Si sitetoedit está presente, pre-cargamos los valores del formulario
  useEffect(() => {
    console.log("sitetoedit", siteModal.sitetoedit); // Verifica que sitetoedit tenga los datos correctos
    if (siteModal.sitetoedit) {
      setFormData({
        siteName: siteModal.sitetoedit.siteName,
        siteAddress: siteModal.sitetoedit.siteAddress,
        siteCity: siteModal.sitetoedit.siteCity,
        siteCountry: siteModal.sitetoedit.siteCountry,
      });
    }
  }, [siteModal.sitetoedit]); // Asegúrate de que useEffect se ejecute cuando sitetoedit cambie

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.siteName && formData.siteAddress && formData.siteCity && formData.siteCountry) {
      // Aquí iría la lógica para crear o actualizar el sitio, por ejemplo
      console.log("Sitio creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (siteModal.sitetoedit) {
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
        label="Nombre de la bodega"
        name="siteName"
        idInput="siteName"
        value={formData.siteName}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Dirección"
        name="siteAddress"
        idInput="siteAddress"
        value={formData.siteAddress}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Ciudad"
        name="siteCity"
        idInput="siteCity"
        value={formData.siteCity}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="País"
        name="siteCountry"
        idInput="siteCountry"
        value={formData.siteCountry}
        onChange={handleChange}
        type="text"
      />
      <div className="w-full py-6">
        <Button type="submit" variant="primary" label={siteModal.sitetoedit ? "Actualizar Bodega" : "Crear Bodega"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={siteModal.isOpen}
      onClose={siteModal.onClose}
      title={siteModal.sitetoedit ? "Editar Bodega" : "Crear Nueva Bodega"}
      body={siteModalBody}
    />
  );
};

export default SiteModal;
