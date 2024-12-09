//componente tagmodal

"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import Modal from "./Modal";
import { useTagModal } from '@/hooks/modals/useTagModal';
import { ITag } from '@/interfaces/Itag';
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import Button from '@/components/shared/Button/Button';

const TagModal = () => {
  const tagModal = useTagModal(); // Usamos el hook de zustand
  const [formData, setFormData] = useState<ITag>({
    name: '',
    color: '',
    priority: 'baja',
    category: ''
  });

  // Si tagToEdit está presente, pre-cargamos los valores del formulario
  useEffect(() => {
    if (tagModal.tagToEdit) {
      setFormData({
        name: tagModal.tagToEdit.name,
        color: tagModal.tagToEdit.color,
        priority: tagModal.tagToEdit.priority,
        category: tagModal.tagToEdit.category
      });
    }
  }, [tagModal.tagToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.name && formData.color && formData.priority && formData.category) {
      // Aquí iría la lógica para guardar o actualizar la etiqueta, por ejemplo
      console.log("Etiqueta creada/actualizada:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (tagModal.tagToEdit) {
        // Lógica para actualizar la etiqueta
        console.log('Editando etiqueta:', formData);
      } else {
        // Lógica para crear la etiqueta
        console.log('Creando nueva etiqueta:', formData);
      }

      tagModal.onClose(); // Cerrar el modal después de crear o actualizar la etiqueta
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

  const tagModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput 
        label="Nombre de etiqueta"
        name="name"
        idInput="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
      />
      <FormInput 
        label="Color"
        name="color"
        idInput="color"
        value={formData.color}
        onChange={handleChange}
        type="color"
      />
      <FormSelectInput 
        label="Prioridad"
        selectName="priority"
        selectId="priority"
        value={formData.priority}
        onChange={handleChange}
        options={[
          { value: 'baja', name: 'Baja' },
          { value: 'media', name: 'Media' },
          { value: 'alta', name: 'Alta' }
        ]}
      />
      <div>
        <Button type="submit" variant="primary" label={tagModal.tagToEdit ? "Actualizar Etiqueta" : "Crear Etiqueta"} />
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
