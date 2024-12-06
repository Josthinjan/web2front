"use client";
import React, { useState } from 'react'
import Modal from './Modal'
import { useLoteModal } from '@/hooks/modals/useLoteModal';
import Form from '@/components/shared/Form/Form';
import { ILote } from '@/interfaces/ILote';
import FormInput from '@/components/shared/Form/FormInput';
import FormCheckbox from '@/components/shared/Form/FormCheckbox';
import Button from '@/components/shared/Button/Button';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import { useFetch } from '@/hooks/useFetch';
import { config } from '@/config/config';
import Label from '../label/Label';

const LoteModal = () => {
  const loteModal = useLoteModal();
  const [formData, setFormData] = useState<ILote>({
    loteCode: '',
    expirationDate: '',
    isExpirable: false,
    manufactoringDate: '',
    productId: 0,
    providerId: 0,
    quantity: 0
  });

  const {data: productsData, loading: productsLoading, error: productsError } = useFetch({
    url: `${config.API_BASE_URL}/products`
  });

  const {data: providersData, loading: providersLoading, error: providersError } = useFetch({
    url: `${config.API_BASE_URL}/providers`
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

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

  const LoteModalBody = (
    <Form onSubmit={handleSubmit}>
      {productsLoading && <Label text='Cargando productos' type='info'/>}
      {productsError && <Label text='Error al cargar productos' type='error'/>}
      {providersLoading && <Label text='Cargando proveedores' type='info'/>}
      {providersError && <Label text='Error al cargar proveedores' type='error'/>}
      <FormInput 
        idInput='loteCode'
        label='Codigo de lote'
        name='loteCode'
        onChange={handleChange}
        type='text'
        value={formData.loteCode}
      />
      <FormSelectInput 
        selectId='productId'
        label='Producto'
        selectName='productId'
        onChange={handleChange}
        options={[
          { value: 0, name: 'Selecciona un producto' }
        ]}
        value={formData.productId.toString()}
      />
      <FormSelectInput
        selectId='providerId'
        label='Proveedor'
        selectName='providerId'
        onChange={handleChange}
        options={[
          { value: 0, name: 'Selecciona un proveedor' }
        ]}
        value={formData.providerId.toString()}
        />
      <FormInput 
        idInput='manufactoringDate'
        label='Fecha de fabricacion'
        name='manufactoringDate'
        onChange={handleChange}
        type='date'
        value={formData.manufactoringDate}
      />
      <FormInput 
        idInput='quantity'
        label='Cantidad'
        name='quantity'
        onChange={handleChange}
        type='number'
        value={formData.quantity}
      />
      <FormCheckbox 
        checked={formData.isExpirable}
        label='Es expirable'
        onChange={handleChange}
        idCheckbox='isExpirable'
        key={formData.isExpirable.toString()}
        nameCheckbox='isExpirable'
      />
      {formData.isExpirable && (
        <FormInput 
          idInput='expirationDate'
          label='Fecha de expiracion'
          name='expirationDate'
          onChange={handleChange}
          type='date'
          value={formData.expirationDate}
        />
      )}
      <div className='mt-3'>
        <Button variant='primary' label='Crear lote' type='submit'/>
      </div>
    </Form>
  );

  return (
    <Modal 
      title='Crear lote'  
      isOpen={loteModal.isOpen}
      onClose={loteModal.onClose}
      body={LoteModalBody}
    />
  );
}

export default LoteModal