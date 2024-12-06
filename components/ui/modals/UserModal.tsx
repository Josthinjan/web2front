"use client";
import React, { FormEvent, useState } from 'react'
import Modal from './Modal'
import { useUserModal, useUserEditModal } from "@/hooks/modals/useUserModal"; // Importa ambos hooks aquí
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import { IUser } from '@/interfaces/IUser';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import Button from '@/components/shared/Button/Button';
import { validateEmail, validateIdentity, validateName } from '@/utils/FormValidation';


const UserModal = () => {
  const userModal = useUserModal();
  const [errorString, setErrorString] = useState<{
    name?: string;
    email?: string;
    cellphone?: string;
    role?: string;
    identity?: string;
    lastname?: string;
  }>({});

 const [formData, setFormData] = useState<IUser>({
    name: '',
    lastname: '',
    cellphone: '',
    email: '',
    identity: '',
    role: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log(formData)
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      cellphone?: string;
      role?: string;
      identity?: string;
      lastname?: string;
    } = {};
    if (formData.identity === "") {
      newErrors.identity = "La cedula de indentidad es requerida";
    } else if (!validateIdentity(formData.identity)) {
      newErrors.identity = "La cedula de identidad debe tener 10 digitos";
    }

    if (formData.email === "") {
      newErrors.email = "El correo es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "El correo no es valido";
    }

    if (formData.name === "") {
      newErrors.name = "El nombre es requerido";
    } else if (!validateName(formData.name)) {
      newErrors.name = "El nombre no es valido";
    }

    if (formData.lastname === "") {
      newErrors.lastname = "El apellido es requerido";
    } else if (!validateName(formData.lastname)) {
      newErrors.lastname = "El apellido no es valido";
    }

    if (formData.cellphone === "") {
      newErrors.cellphone = "El telefono es requerido";
    } else if (formData.cellphone.length < 10) {
      newErrors.cellphone = "El telefono debe tener al menos 10 digitos";
    }
    setErrorString(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const UserModalBody = (
      <Form onSubmit={handleSubmit}>
        <FormInput
          idInput='name'
          label='Nombre'
          name='name'
          value={formData.name}
          onChange={handleChange}
          type='text'
          error={errorString.name}
        />
        <FormInput
          idInput='lastname'
          label='Apellido'
          name='lastname'
          value={formData.lastname}
          onChange={handleChange}
          type='text'
          error={errorString.lastname}
        />
        <FormInput
          idInput='cellphone'
          label='Celular'
          name='cellphone'
          value={formData.cellphone}
          onChange={handleChange}
          type='text'
          error={errorString.cellphone}
        />
        <FormInput 
          idInput='indentity'
          label='Cedula de identidad'
          name='identity'
          onChange={handleChange}
          type='text'
          value={formData.identity}
          error={errorString.identity}
        />
        <FormInput 
          idInput='email'
          label='Correo'
          name='email'
          value={formData.email}
          onChange={handleChange}
          type='email'
          error={errorString.email}
        />
        <FormSelectInput 
          label='Rol'
          selectName='role'
          selectId='role'
          value={formData.role}
          onChange={handleChange}
          options={[
            { name: 'Administrador', value: 'admin' },
            { name: 'Usuario', value: 'user' },
          ]}
        />
        <div className='flex justify-end'>
          <Button variant='primary' type='submit' label='Crear usuario' />
        </div>
      </Form>
    );

  return (
    <Modal 
      title='Crear usuario'
      isOpen={userModal.isOpen}
      onClose={userModal.onClose}
      body={UserModalBody}
    />
 )
}




export default UserModal