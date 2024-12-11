"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import Modal from './Modal';
import { useMetodoPagoModal } from '@/hooks/modals/useMetodoPagoModal'; // Hook para manejar el estado del modal
import { IMetodoPago } from '@/interfaces/IMetodoPago'; // Interfaz del método de pago
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import Button from '@/components/shared/Button/Button';

const MetodoPagoModal = () => {
  const metodoPagoModal = useMetodoPagoModal(); // Usamos el hook de zustand para el estado del modal
  const [formData, setFormData] = useState<IMetodoPago>({
    id: 0,
    nombre: '',
    descripcion: '',
  });

  // Si metodoPagoToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (metodoPagoModal.metodoPagoToEdit) {
      setFormData({
        id: metodoPagoModal.metodoPagoToEdit.id,
        nombre: metodoPagoModal.metodoPagoToEdit.nombre,
        descripcion: metodoPagoModal.metodoPagoToEdit.descripcion,
      });
    } else {
      // Limpiar los campos del formulario si no hay un método de pago para editar
      setFormData({
        id: 0,
        nombre: '',
        descripcion: '',
      });
    }
  }, [metodoPagoModal.metodoPagoToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.nombre && formData.descripcion) {
      // Lógica para guardar o actualizar el método de pago
      console.log("Método de pago creado/actualizado:", formData);

      if (metodoPagoModal.metodoPagoToEdit) {
        // Lógica para actualizar el método de pago
        console.log('Editando método de pago:', formData);
      } else {
        // Lógica para crear el método de pago
        console.log('Creando nuevo método de pago:', formData);
      }

      metodoPagoModal.onClose(); // Cerrar el modal después de crear o actualizar el método de pago
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

  const metodoPagoModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Método de Pago"
        name="nombre"
        idInput="nombre"
        value={formData.nombre}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Descripción"
        name="descripcion"
        idInput="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        type="text"
      />
      <div className="mt-4">
        <Button type="submit" variant="primary" label={metodoPagoModal.metodoPagoToEdit ? "Actualizar Método de Pago" : "Crear Método de Pago"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={metodoPagoModal.isOpen}
      onClose={metodoPagoModal.onClose}
      title={metodoPagoModal.metodoPagoToEdit ? "Editar Método de Pago" : "Crear Método de Pago"}
      body={metodoPagoModalBody}
    />
  );
};

export default MetodoPagoModal;
