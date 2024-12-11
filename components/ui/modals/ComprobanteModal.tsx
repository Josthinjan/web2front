"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import Modal from './Modal';
import { useComprobanteModal } from '@/hooks/modals/useComprobanteModal'; // Hook para manejar el estado del modal
import { IComprobante, estadoComprobante } from '@/interfaces/IComprobante'; // Interfaz del comprobante
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import Button from '@/components/shared/Button/Button';

const ComprobanteModal = () => {
  const comprobanteModal = useComprobanteModal(); // Usamos el hook de zustand para el estado del modal
  const [formData, setFormData] = useState<IComprobante>({
    fecha_emision: '',
    codigo_lote: '',
    usuario_id: '',
    producto_id: '',
    cantidad: 0,
    precio_total: 0,
    estado: 'pendiente', // Estado por defecto
  });

  // Si comprobanteToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (comprobanteModal.comprobanteToEdit) {
      setFormData({
        fecha_emision: comprobanteModal.comprobanteToEdit.fecha_emision,
        codigo_lote: comprobanteModal.comprobanteToEdit.codigo_lote,
        usuario_id: comprobanteModal.comprobanteToEdit.usuario_id,
        producto_id: comprobanteModal.comprobanteToEdit.producto_id,
        cantidad: comprobanteModal.comprobanteToEdit.cantidad,
        precio_total: comprobanteModal.comprobanteToEdit.precio_total,
        estado: comprobanteModal.comprobanteToEdit.estado,
      });
    }
  }, [comprobanteModal.comprobanteToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.fecha_emision && formData.codigo_lote && formData.usuario_id && formData.producto_id && formData.cantidad > 0 && formData.precio_total > 0) {
      // Lógica para guardar o actualizar el comprobante
      console.log("Comprobante creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (comprobanteModal.comprobanteToEdit) {
        // Lógica para actualizar el comprobante
        console.log('Editando comprobante:', formData);
      } else {
        // Lógica para crear el comprobante
        console.log('Creando nuevo comprobante:', formData);
      }

      comprobanteModal.onClose(); // Cerrar el modal después de crear o actualizar el comprobante
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

  const comprobanteModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Fecha de Emisión"
        name="fecha_emision"
        idInput="fecha_emision"
        value={formData.fecha_emision}
        onChange={handleChange}
        type="date"
      />
      <FormInput
        label="Código de Lote"
        name="codigo_lote"
        idInput="codigo_lote"
        value={formData.codigo_lote}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="ID de Usuario"
        name="usuario_id"
        idInput="usuario_id"
        value={formData.usuario_id}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="ID de Producto"
        name="producto_id"
        idInput="producto_id"
        value={formData.producto_id}
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
        label="Precio Total"
        name="precio_total"
        idInput="precio_total"
        value={formData.precio_total}
        onChange={handleChange}
        type="number"
      />
      <FormSelectInput
        label="Estado"
        selectName="estado"
        selectId="estado"
        value={formData.estado}
        onChange={handleChange}
        options={[
          { value: 'pendiente', name: 'Pendiente' },
          { value: 'pagado', name: 'Pagado' },
        ]}
      />
      <div>
        <Button type="submit" variant="primary" label={comprobanteModal.comprobanteToEdit ? "Actualizar Comprobante" : "Crear Comprobante"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={comprobanteModal.isOpen}
      onClose={comprobanteModal.onClose}
      title={comprobanteModal.comprobanteToEdit ? "Editar Comprobante" : "Crear Comprobante"}
      body={comprobanteModalBody}
    />
  );
};

export default ComprobanteModal;
