"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import Modal from './Modal';
import { useLoteModal } from '@/hooks/modals/useLoteModal'; // Hook para manejar el estado del modal
import { ILote } from '@/interfaces/ILote'; // Interfaz del lote
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import Button from '@/components/shared/Button/Button';

const LoteModal = () => {
  const loteModal = useLoteModal(); // Usamos el hook de zustand para el estado del modal
  const [formData, setFormData] = useState<ILote>({
    productId: 0,
    providerId: 0,
    loteCode: '',
    manufactoringDate: '',
    expirationDate: '',
    quantity: 0,
    isExpirable: false, // Estado por defecto
  });

  // Si loteToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (loteModal.loteToEdit) {
      setFormData({
        productId: loteModal.loteToEdit.productId,
        providerId: loteModal.loteToEdit.providerId,
        loteCode: loteModal.loteToEdit.loteCode,
        manufactoringDate: loteModal.loteToEdit.manufactoringDate,
        expirationDate: loteModal.loteToEdit.expirationDate,
        quantity: loteModal.loteToEdit.quantity,
        isExpirable: loteModal.loteToEdit.isExpirable,
      });
    }
  }, [loteModal.loteToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formData.productId > 0 &&
      formData.providerId > 0 &&
      formData.loteCode &&
      formData.manufactoringDate &&
      formData.expirationDate &&
      formData.quantity > 0
    ) {
      // Lógica para guardar o actualizar el lote
      console.log("Lote creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (loteModal.loteToEdit) {
        // Lógica para actualizar el lote
        console.log('Editando lote:', formData);
      } else {
        // Lógica para crear el lote
        console.log('Creando nuevo lote:', formData);
      }

      loteModal.onClose(); // Cerrar el modal después de crear o actualizar el lote
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

  const loteModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Código de Lote"
        name="loteCode"
        idInput="loteCode"
        value={formData.loteCode}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="ID de Producto"
        name="productId"
        idInput="productId"
        value={formData.productId}
        onChange={handleChange}
        type="number"
      />
      <FormInput
        label="ID de Proveedor"
        name="providerId"
        idInput="providerId"
        value={formData.providerId}
        onChange={handleChange}
        type="number"
      />
      <FormInput
        label="Fecha de Fabricación"
        name="manufactoringDate"
        idInput="manufactoringDate"
        value={formData.manufactoringDate}
        onChange={handleChange}
        type="date"
      />
      <FormInput
        label="Fecha de Expiración"
        name="expirationDate"
        idInput="expirationDate"
        value={formData.expirationDate}
        onChange={handleChange}
        type="date"
      />
      <FormInput
        label="Cantidad"
        name="quantity"
        idInput="quantity"
        value={formData.quantity}
        onChange={handleChange}
        type="number"
      />
      <FormSelectInput
        label="¿Es Expirable?"
        selectName="isExpirable"
        selectId="isExpirable"
        value={formData.isExpirable ? 'true' : 'false'}
        onChange={handleChange}
        options={[
          { value: 'true', name: 'Sí' },
          { value: 'false', name: 'No' },
        ]}
      />
      <div>
        <Button type="submit" variant="primary" label={loteModal.loteToEdit ? "Actualizar Lote" : "Crear Lote"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={loteModal.isOpen}
      onClose={loteModal.onClose}
      title={loteModal.loteToEdit ? "Editar Lote" : "Crear Lote"}
      body={loteModalBody}
    />
  );
};

export default LoteModal;
