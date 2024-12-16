"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useTagModal } from "@/hooks/modals/useTagModal";
import { ITag } from "@/interfaces/Itag";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Swal from "sweetalert2";

// Definir las propiedades que recibe TagModal
interface TagModalProps {
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagModal: React.FC<TagModalProps> = ({ setShouldRefetch }) => {
  const tagModal = useTagModal();
  const [formData, setFormData] = useState<ITag>({
    id_etiqueta: 0,
    nombre: "",
    color_hex: "",
    descripcion: "",
    categoria: "",
    prioridad: "baja",
    isActive: true,
    created_at: "",
    updated_at: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-cargar los datos si estamos editando una etiqueta
  useEffect(() => {
    if (tagModal.tagToEdit) {
      setFormData({
        id_etiqueta: tagModal.tagToEdit.id_etiqueta,
        nombre: tagModal.tagToEdit.nombre,
        color_hex: tagModal.tagToEdit.color_hex,
        descripcion: tagModal.tagToEdit.descripcion || "",
        categoria: tagModal.tagToEdit.categoria,
        prioridad: tagModal.tagToEdit.prioridad,
        isActive: tagModal.tagToEdit.isActive,
        created_at: tagModal.tagToEdit.created_at,
        updated_at: tagModal.tagToEdit.updated_at,
      });
    } else {
      // Resetear formData al abrir para crear una nueva etiqueta
      setFormData({
        id_etiqueta: 0,
        nombre: "",
        color_hex: "",
        descripcion: "",
        categoria: "",
        prioridad: "baja",
        isActive: true,
        created_at: "",
        updated_at: "",
      });
    }
  }, [tagModal.tagToEdit]); // Este useEffect se ejecuta cada vez que se actualiza tagModal.tagToEdit

  const { data, error, loading, refetch } = useFetch<ITag>({
    url: tagModal.tagToEdit
      ? `/etiquetas/${tagModal.tagToEdit.id_etiqueta}`
      : "/etiquetas",
    method: tagModal.tagToEdit ? "PUT" : "POST",
    body: JSON.stringify(formData),
    skipToken: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar que todos los campos estén completos
    if (!formData.nombre || !formData.color_hex || !formData.prioridad || !formData.categoria) {
      Swal.fire("Error", "Por favor, completa todos los campos correctamente.", "error");
      return;
    }

    // Evitar que se envíe el formulario si ya está en proceso de envío
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await refetch();

      // Si hay un error, muestra el mensaje de error
      if (error) {
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
        return;
      }

      // Si los datos se procesan correctamente
      if (data) {
        Swal.fire("Éxito", tagModal.tagToEdit ? "Etiqueta actualizada correctamente" : "Etiqueta creada correctamente", "success");

        // Indicamos que es necesario hacer un refetch
        setShouldRefetch(true);

        // Cerramos el modal después de la operación
        tagModal.onClose();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ocurrió un error");
      Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const tagModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre de etiqueta"
        name="nombre"
        idInput="nombre"
        value={formData.nombre}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Color"
        name="color_hex"
        idInput="color_hex"
        value={formData.color_hex}
        onChange={handleChange}
        type="color"
      />
      <FormInput
        label="Descripción"
        name="descripcion"
        idInput="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Categoría"
        name="categoria"
        idInput="categoria"
        value={formData.categoria}
        onChange={handleChange}
        type="text"
      />
      <FormSelectInput
        label="Prioridad"
        selectName="prioridad"
        selectId="prioridad"
        value={formData.prioridad}
        onChange={handleChange}
        options={[
          { value: "baja", name: "Baja" },
          { value: "media", name: "Media" },
          { value: "alta", name: "Alta" },
        ]}
      />
      <div className="flex items-center">
        <label className="mr-2">Activo</label>
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
      </div>
      <div>
        <Button
          type="submit"
          variant="primary"
          label={tagModal.tagToEdit ? "Actualizar Etiqueta" : "Crear Etiqueta"}
          isDisabled={isSubmitting} // Deshabilitar el botón mientras se está enviando la solicitud
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={tagModal.isOpen}
      onClose={tagModal.onClose}
      title={tagModal.tagToEdit ? "Editar Etiqueta" : "Crear Etiqueta"}
      body={tagModalBody}
    />
  );
};

export default TagModal;
