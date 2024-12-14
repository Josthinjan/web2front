import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useSitesModal } from "@/hooks/modals/useSitesModal";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";
import Swal from "sweetalert2";
import { ISite } from "@/interfaces/ISite";
import { useFetch } from "@/hooks/useFetch";

const SiteModal = ({ setShouldRefetch }: { setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const siteModal = useSitesModal();
  const [formData, setFormData] = useState<ISite>({
    nombre_sitio: "",
    direccion: "",
    ciudad: "",
    pais: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (siteModal.siteToEdit) {
      setFormData({
        id_sitio: siteModal.siteToEdit.id_sitio,
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

  const url = siteModal.siteToEdit
    ? `/sitios/${siteModal.siteToEdit.id_sitio}`
    : `/sitios`;

  const { data, error, loading, refetch } = useFetch<ISite>({
    url,
    method: siteModal.siteToEdit ? "PUT" : "POST",
    body: JSON.stringify(formData),
    skipToken: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nombre_sitio || !formData.direccion || !formData.ciudad || !formData.pais) {
      Swal.fire("Error", "Por favor, completa todos los campos.", "error");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await refetch();

      if (error) {
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
        return;
      }

      if (data) {
        Swal.fire(
          "Éxito",
          siteModal.siteToEdit ? "Bodega actualizada correctamente" : "Bodega creada correctamente",
          "success"
        );

        // Marcar que necesitamos refetch de los datos
        setShouldRefetch(true);

        // Cerrar el modal solo después de la acción exitosa
        siteModal.onClose();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ocurrió un error");
      Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
    } finally {
      setIsSubmitting(false);
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
