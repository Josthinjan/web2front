"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useReturnModal } from "@/hooks/modals/useReturnModal"; // Hook para manejar el estado del modal
import { IReturn } from "@/interfaces/IReturn"; // Interfaz del retorno
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import Button from "@/components/shared/Button/Button";

const ReturnModal = () => {
  const returnModal = useReturnModal(); // Usamos el hook para el estado del modal
  const [formData, setFormData] = useState<IReturn>({
    fechaRetorno: "",
    codigoLote: "",
    nombreUsuario: "",
    nombreProducto: "",
    cantidad: 0,
    motivoRetorno: "",
    estado: "Pendiente", // Estado por defecto
  });

  // Si returnToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (returnModal.returnToEdit) {
      setFormData({
        fechaRetorno: returnModal.returnToEdit.fechaRetorno,
        codigoLote: returnModal.returnToEdit.codigoLote,
        nombreUsuario: returnModal.returnToEdit.nombreUsuario,
        nombreProducto: returnModal.returnToEdit.nombreProducto,
        cantidad: returnModal.returnToEdit.cantidad,
        motivoRetorno: returnModal.returnToEdit.motivoRetorno,
        estado: returnModal.returnToEdit.estado,
      });
    } else {
      // Limpiar los datos cuando no se está editando
      setFormData({
        fechaRetorno: "",
        codigoLote: "",
        nombreUsuario: "",
        nombreProducto: "",
        cantidad: 0,
        motivoRetorno: "",
        estado: "Pendiente",
      });
    }
  }, [returnModal.returnToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formData.fechaRetorno &&
      formData.codigoLote &&
      formData.nombreUsuario &&
      formData.nombreProducto &&
      formData.cantidad > 0 &&
      formData.motivoRetorno
    ) {
      // Lógica para guardar o actualizar el retorno
      console.log("Retorno creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (returnModal.returnToEdit) {
        // Lógica para actualizar el retorno
        console.log("Editando retorno:", formData);
      } else {
        // Lógica para crear el retorno
        console.log("Creando nuevo retorno:", formData);
      }

      returnModal.onClose(); // Cerrar el modal después de crear o actualizar el retorno
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

  const returnModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Fecha de Retorno"
        name="fechaRetorno"
        idInput="fechaRetorno"
        value={formData.fechaRetorno}
        onChange={handleChange}
        type="date"
      />
      <FormInput
        label="Código de Lote"
        name="codigoLote"
        idInput="codigoLote"
        value={formData.codigoLote}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Nombre del Usuario"
        name="nombreUsuario"
        idInput="nombreUsuario"
        value={formData.nombreUsuario}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Nombre del Producto"
        name="nombreProducto"
        idInput="nombreProducto"
        value={formData.nombreProducto}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Cantidad"
        name="cantidad"
        idInput="cantidad"
        value={formData.cantidad}
        onChange={handleChange}
        type="number"
      />
      <FormInput
        label="Motivo de Retorno"
        name="motivoRetorno"
        idInput="motivoRetorno"
        value={formData.motivoRetorno}
        onChange={handleChange}
        type="text"
      />
      <FormSelectInput
        label="Estado"
        selectName="estado"
        selectId="estado"
        value={formData.estado}
        onChange={handleChange}
        options={[
          { value: "Pendiente", name: "Pendiente" },
          { value: "Procesado", name: "Procesado" },
          { value: "Cancelado", name: "Cancelado" },
        ]}
      />
      <div>
        <Button type="submit" variant="primary" label={returnModal.returnToEdit ? "Actualizar Retorno" : "Crear Retorno"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={returnModal.isOpen}
      onClose={returnModal.onClose}
      title={returnModal.returnToEdit ? "Editar Retorno" : "Crear Retorno"}
      body={returnModalBody}
    />
  );
};

export default ReturnModal;
