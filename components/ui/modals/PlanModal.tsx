"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import Modal from './Modal';
import { usePlanModal } from '@/hooks/modals/usePlanModal'; // Hook para manejar el estado del modal de planes
import { IPlan } from '@/interfaces/IPlan'; // Interfaz del plan
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import Button from '@/components/shared/Button/Button';

const PlanModal = () => {
  const planModal = usePlanModal(); // Usamos el hook para manejar el estado del modal de planes
  const [formData, setFormData] = useState<IPlan>({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    estado: 'Activo',
    ciclos_de_facturacion: 'Mensual',
    soporta_cantidades: 'No', // Estado por defecto
  });

  // Si planToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (planModal.planToEdit) {
      setFormData({
        id: planModal.planToEdit.id,
        nombre: planModal.planToEdit.nombre,
        descripcion: planModal.planToEdit.descripcion,
        precio: planModal.planToEdit.precio,
        estado: planModal.planToEdit.estado,
        ciclos_de_facturacion: planModal.planToEdit.ciclos_de_facturacion,
        soporta_cantidades: planModal.planToEdit.soporta_cantidades,
      });
    } else {
      // Limpiar el formulario si no hay plan para editar
      setFormData({
        id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        estado: 'Activo', // Valor por defecto
        ciclos_de_facturacion: 'Mensual', // Valor por defecto
        soporta_cantidades: 'No', // Valor por defecto
      });
    }
  }, [planModal.planToEdit]); // Se ejecuta cada vez que cambie `planToEdit`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.nombre && formData.descripcion && formData.precio && formData.estado) {
      // Lógica para guardar o actualizar el plan
      console.log("Plan creado/actualizado:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (planModal.planToEdit) {
        // Lógica para actualizar el plan
        console.log('Editando plan:', formData);
      } else {
        // Lógica para crear el plan
        console.log('Creando nuevo plan:', formData);
      }

      planModal.onClose(); // Cerrar el modal después de crear o actualizar el plan
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

  const planModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Plan"
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
      <FormInput
        label="Precio"
        name="precio"
        idInput="precio"
        value={formData.precio}
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
          { value: 'Activo', name: 'Activo' },
          { value: 'Inactivo', name: 'Inactivo' },
        ]}
      />
      <FormSelectInput
        label="Ciclos de Facturación"
        selectName="ciclos_de_facturacion"
        selectId="ciclos_de_facturacion"
        value={formData.ciclos_de_facturacion}
        onChange={handleChange}
        options={[
          { value: 'Mensual', name: 'Mensual' },
          { value: 'Anual', name: 'Anual' },
        ]}
      />
      <FormSelectInput
        label="¿Soporta Cantidades?"
        selectName="soporta_cantidades"
        selectId="soporta_cantidades"
        value={formData.soporta_cantidades}
        onChange={handleChange}
        options={[
          { value: 'Sí', name: 'Sí' },
          { value: 'No', name: 'No' },
        ]}
      />
      <div>
        <Button type="submit" variant="primary" label={planModal.planToEdit ? "Actualizar Plan" : "Crear Plan"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={planModal.isOpen}
      onClose={planModal.onClose}
      title={planModal.planToEdit ? "Editar Plan" : "Crear Plan"}
      body={planModalBody}
    />
  );
};

export default PlanModal;
