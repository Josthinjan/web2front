import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import useSitesModal from "@/hooks/modals/useSitesModal";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Swal from "sweetalert2";

const SiteModal = () => {
  const siteModal = useSitesModal();
  const [formData, setFormData] = useState({
    siteName: "",
    siteAddress: "",
    siteCity: "",
    siteCountry: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-cargar datos si se está editando un sitio
  useEffect(() => {
    if (siteModal.sitetoedit) {
      setFormData({
        siteName: siteModal.sitetoedit.siteName || "",
        siteAddress: siteModal.sitetoedit.siteAddress || "",
        siteCity: siteModal.sitetoedit.siteCity || "",
        siteCountry: siteModal.sitetoedit.siteCountry || "",
      });
    } else {
      setFormData({
        siteName: "",
        siteAddress: "",
        siteCity: "",
        siteCountry: "",
      });
    }
  }, [siteModal.sitetoedit]);

  // Función para manejar el submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación básica
    if (!formData.siteName || !formData.siteAddress || !formData.siteCity || !formData.siteCountry) {
      Swal.fire("Error", "Por favor, completa todos los campos.", "error");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const url = siteModal.sitetoedit
      ? `/sitios/${siteModal.sitetoedit.id}`
      : `/sitios`;

    // Configuración de la solicitud
    const config: RequestInit = {
      method: siteModal.sitetoedit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    // Asegúrate de que la configuración de fetch está correctamente definida
    console.log("Configuración de la solicitud:", config);

    const { data, error, loading } = useFetch({
      url,
      config,
    });

    if (loading) {
      return; // Evitar que el formulario se envíe mientras se está procesando
    }

    if (data) {
      Swal.fire(
        "Éxito",
        siteModal.sitetoedit ? "Bodega actualizada correctamente" : "Bodega creada correctamente",
        "success"
      );
      siteModal.onClose();
    }

    if (error) {
      console.error(error);
      setSubmitError(error.message);
      Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
    }

    setIsSubmitting(false);
  };

  // Manejar los cambios en los campos del formulario
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
        <Button
          type="submit"
          variant="primary"
          label={siteModal.sitetoedit ? "Actualizar Bodega" : "Crear Bodega"}
          disabled={isSubmitting} // Deshabilitar mientras se realiza el fetch
        />
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
