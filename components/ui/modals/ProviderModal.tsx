import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal"; // Modal general
import { useProviderModal } from "@/hooks/modals/useProviderModal"; // Hook para manejar el estado del modal
import { IProvider } from "@/interfaces/IProvider"; // Interfaz del proveedor
import Form from "@/components/shared/Form/Form"; // Formulario general
import FormInput from "@/components/shared/Form/FormInput"; // Input de formulario
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput"; // Input select para el estado "activo"
import Button from "@/components/shared/Button/Button"; // Botón de formulario
import Swal from "sweetalert2"; // Alerta
import { useFetch } from "@/hooks/useFetch"; // Hook para realizar fetch

const ProviderModal = ({ setShouldRefetch }: { setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const providerModal = useProviderModal(); // Usamos el hook para el estado del modal
  const [formData, setFormData] = useState<IProvider>({
    nombre: "",
    direccion: "",
    email: "",
    telefono: "",
    Cuidad: "",
    activo: true, // Estado por defecto
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío del formulario
  const [submitError, setSubmitError] = useState<string | null>(null); // Para manejar errores de envío

  // Pre-cargar datos en caso de estar editando un proveedor
  useEffect(() => {
    if (providerModal.providerToEdit) {
      setFormData({
        nombre: providerModal.providerToEdit.nombre || "",
        direccion: providerModal.providerToEdit.direccion || "",
        email: providerModal.providerToEdit.email || "",
        telefono: providerModal.providerToEdit.telefono || "",
        Cuidad: providerModal.providerToEdit.Cuidad || "",
        activo: providerModal.providerToEdit.activo,
      });
    } else {
      // Limpiar los datos cuando no se está editando
      setFormData({
        nombre: "",
        direccion: "",
        email: "",
        telefono: "",
        Cuidad: "",
        activo: true,
      });
    }
  }, [providerModal.providerToEdit]);

  // Determina la URL y método para el fetch (crear o actualizar)
  const url = providerModal.providerToEdit
    ? `/proveedores/${providerModal.providerToEdit.id_proveedor}` // URL para editar
    : `/proveedor`; // URL para crear nuevo

  const { data, error, loading, refetch } = useFetch<IProvider>({
    url,
    method: providerModal.providerToEdit ? "PUT" : "POST", // Cambia el método según si es edición o creación
    body: JSON.stringify(formData),
    skipToken: false,
  });

  // Manejo del formulario
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.Cuidad) {
      Swal.fire("Error", "Por favor, completa todos los campos.", "error");
      return;
    }

    const isEmailValid = /^\S+@\S+\.\S+$/.test(formData.email);
    if (!isEmailValid) {
      Swal.fire("Error", "Por favor, ingresa un correo electrónico válido.", "error");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Esperamos a que la operación de fetch y refetch se completen antes de mostrar la alerta
      await refetch();  // Esperamos a que refetch se complete

      if (error) {
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
        return;
      }

      if (data) {
        Swal.fire(
          "Éxito",
          providerModal.providerToEdit ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente",
          "success"
        );

        setShouldRefetch(true); // Refrescar la lista de proveedores después de crear o actualizar
        providerModal.onClose(); // Cerrar el modal después de la acción exitosa
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
      [name]: name === "activo" ? value === "true" : value, // Convierte el valor de activo a booleano
    }));
  };

  // Cuerpo del modal con el formulario
  const providerModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Proveedor"
        name="nombre"
        idInput="nombre"
        value={formData.nombre}
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
        name="telefono"
        idInput="telefono"
        value={formData.telefono}
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
        label="Cuidad"
        name="Cuidad"
        idInput="Cuidad"
        value={formData.Cuidad}
        onChange={handleChange}
        type="text"
      />
      <FormSelectInput
        label="¿Está Activo?"
        selectName="activo"
        selectId="activo"
        value={formData.activo ? "true" : "false"}
        onChange={handleChange}
        options={[
          { value: "true", name: "Sí" },
          { value: "false", name: "No" },
        ]}
      />
      <div className="w-full py-6">
        <Button
          type="submit"
          variant="primary"
          label={providerModal.providerToEdit ? "Actualizar Proveedor" : "Crear Proveedor"}
          isDisabled={isSubmitting} // Deshabilita el botón mientras se está enviando
        />
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
