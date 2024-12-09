import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Modal from "./Modal";
import { useProviderModal } from "@/hooks/modals/useProviderModal";
import { IProvider } from "@/interfaces/IProvider";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormCheckbox from "@/components/shared/Form/FormCheckbox";
import Button from "@/components/shared/Button/Button";
import { validateEmail, validateName } from '@/utils/FormValidation';

const ProviderModal = () => {

  const providerModal = useProviderModal();
  const [formData, setFormData] = useState<IProvider>({
    name: "",
    email: "",
    city: "",
    phone: "",
    active: true,
    address: "",
  });
  
  const [error, setError] = useState<{
    name?: string;
    email?: string;
    city?: string;
    phone?: string;
    address?: string;
  }>({});

  // useEffect para pre-cargar los datos cuando se edita un proveedor
  useEffect(() => {
    if (providerModal.providerToEdit) {
      setFormData({
        name: providerModal.providerToEdit.name,
        email: providerModal.providerToEdit.email,
        city: providerModal.providerToEdit.city,
        phone: providerModal.providerToEdit.phone,
        active: providerModal.providerToEdit.status === 'Activo',
        address: providerModal.providerToEdit.address,
      });
    } else {
      // Resetea el formulario si no hay proveedor para editar
      setFormData({
        name: "",
        email: "",
        city: "",
        phone: "",
        active: true,
        address: "",
      });
    }
  }, [providerModal.providerToEdit]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      city?: string;
      phone?: string;
      address?: string;
    } = {};
    if (formData.name === "") {
      newErrors.name = "El nombre es requerido";
    } else if (!validateName(formData.name)) {
      newErrors.name = "El nombre no puede contener numeros";
    }
    if (formData.email === "") {
      newErrors.email = "El correo es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "El correo no es valido";
    }
    if (formData.city === "") {
      newErrors.city = "La ciudad es requerida";
    }
    if (formData.phone === "") {
      newErrors.phone = "El telefono es requerido";
    }
    if (formData.address === "") {
      newErrors.address = "La dirección es requerida";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return false;
    }
    return true;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Si hay un proveedor para editar, maneja la edición
    if (providerModal.providerToEdit) {
      // Lógica de actualización
      console.log('Actualizando proveedor', formData);
      // Aquí puedes hacer una llamada a la API para actualizar el proveedor
    } else {
      // Lógica de creación
      console.log('Creando proveedor', formData);
      // Aquí puedes hacer una llamada a la API para crear un nuevo proveedor
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as | HTMLInputElement | HTMLSelectElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const providerModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput 
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        idInput="name"
        type="text"
        error={error.name}
      />
      <FormInput 
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        idInput="email"
        type="email"
        error={error.email}
      />
      <FormInput 
        label="Ciudad"
        name="city"
        value={formData.city}
        onChange={handleChange}
        idInput="city"
        type="text"
        error={error.city}
      />
      <FormInput 
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        idInput="phone"
        type="text"
        error={error.phone}
      />
      <FormInput 
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
        idInput="address"
        type="text"
        error={error.address}
      />
      <FormCheckbox
        label="Activo"
        nameCheckbox="active"
        checked={formData.active}
        onChange={handleChange}
        idCheckbox="active"
      />
      
      <div>
        <Button type="submit" variant="primary" label={providerModal.providerToEdit ? "Actualizar Proveedor" : "Crear Proveedor"} />
      </div>
    </Form>
  );

  return (
    <Modal 
      title={providerModal.providerToEdit ? "Editar Proveedor" : "Crear Proveedor"}
      isOpen={providerModal.isOpen}
      onClose={providerModal.onClose}
      body={providerModalBody}
    /> 
  );
};

export default ProviderModal;
