import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useSitesModal } from "@/hooks/modals/useSitesModal";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Swal from "sweetalert2";
import { ISite } from "@/interfaces/ISite"; // Importa la interfaz ISite

const SiteModal = () => {
  const siteModal = useSitesModal();

  // Estado inicial usando la interfaz ISite
  const [formData, setFormData] = useState<ISite>({
    nombre_sitio: "",
    direccion: "",
    ciudad: "",
    pais: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-cargar datos si se está editando un sitio
  useEffect(() => {
    if (siteModal.siteToEdit) {
      setFormData({
        nombre_sitio: siteModal.siteToEdit.nombre_sitio || "",
        direccion: siteModal.siteToEdit.direccion || "",
        ciudad: siteModal.siteToEdit.ciudad || "",
        pais: siteModal.siteToEdit.pais || "",
      });
    } else {
      setFormData({
        nombre_sitio: "",
        direccion: "",
        ciudad: "",
        pais: "",
      });
    }
  }, [siteModal.siteToEdit]);

  // Definir la URL para el fetch
  const url = siteModal.siteToEdit
    ? `/sitios/${siteModal.siteToEdit.id}`
    : `/sitios`;

  // Usar useFetch aquí para que esté en el cuerpo del componente
  const { data, error, loading, refetch } = useFetch<ISite>({
    url,
    skipToken: false, // Cambia según necesites
  });

  // Función para manejar el submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación básica
    if (!formData.nombre_sitio || !formData.direccion || !formData.ciudad || !formData.pais) {
      Swal.fire("Error", "Por favor, completa todos los campos.", "error");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Mapea los datos a los nombres que espera el backend
    const mappedFormData: ISite = {
      nombre_sitio: formData.nombre_sitio,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      pais: formData.pais,
    };

    // Configuración de la solicitud
    const config: RequestInit = {
      method: siteModal.siteToEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mappedFormData),
    };

    // Usa el hook `useFetch` para enviar la solicitud
    if (!loading && !error) {
      // Lógica para manejar los datos o errores después de hacer el fetch
      if (data) {
        Swal.fire(
          "Éxito",
          siteModal.siteToEdit ? "Bodega actualizada correctamente" : "Bodega creada correctamente",
          "success"
        );
        siteModal.onClose();
      }

      if (error) {
        console.error(error);
        setSubmitError(error.message);
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
      }
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
        name="nombre_sitio"
        idInput="nombre_sitio"
        value={formData.nombre_sitio}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Dirección"
        name="direccion"
        idInput="direccion"
        value={formData.direccion}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Ciudad"
        name="ciudad"
        idInput="ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="País"
        name="pais"
        idInput="pais"
        value={formData.pais}
        onChange={handleChange}
        type="text"
      />
      <div className="w-full py-6">
        <Button
          type="submit"
          variant="primary"
          label={siteModal.siteToEdit ? "Actualizar Bodega" : "Crear Bodega"}
        isDisabled={isSubmitting}
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={siteModal.isOpen}
      onClose={siteModal.onClose}
      title={siteModal.siteToEdit ? "Editar Bodega" : "Crear Nueva Bodega"}
      body={siteModalBody}
    />
  );
};

export default SiteModal;
