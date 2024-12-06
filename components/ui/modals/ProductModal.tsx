import React, { useState } from 'react'
import Modal from './Modal'
import { useProductModal } from '@/hooks/modals/useProductModal'
import { IProducts } from '@/interfaces/IProducts';
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import { useFetch } from '@/hooks/useFetch';
import Label from '../label/Label';
import FormSelectInput from '@/components/shared/Form/selectElement/FormSelectInput';
import { ITag } from '@/interfaces/Itag';
import Button from '@/components/shared/Button/Button';
const ProductModal = () => {
  const productModal = useProductModal();

  const { data: tagData, loading: tagLoading, error: tagError } = useFetch({
    url: 'api/tags',
  });

  const { data: categoryData, loading: categoryLoading, error: categoryError } = useFetch({
    url: 'api/categories',
  });

  const newCategoryData = categoryData?.map((category: any) => ({
    name: category.name,
    value: category.id
  }));

  const newTagData = tagData?.map((tag: any) => ({
    name: tag.name,
    value: tag.id
  }));

  const [formData, setFormData] = useState<IProducts>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    tagId: null,
    categoriId: null
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const productModalBody = (
    <>
    {tagLoading && <Label text='Cargando etiquetas...' type='info' />}
    {tagError && <Label text='Error al cargar etiquetas' type='error' />}
      <Form onSubmit={handleSubmit}>
        <FormInput 
          label='Nombre del producto'
          name='name'
          idInput='name'
          value={formData.name}
          onChange={handleChange}
          type='text'
        />
        <FormSelectInput 
          label='Etiqueta'
          selectName='tagId'
          selectId='tagId'
          value={formData.tagId?.toString()}
          onChange={handleChange}
          options={newTagData}
        />
        <FormInput 
          label='Descripción'
          name='description'
          idInput='description'
          value={formData.description}
          onChange={handleChange}
          type='text'
        />
        <FormInput 
          label='Precio'
          name='price'
          idInput='price'
          value={formData.price.toString()}
          onChange={handleChange}
          type='number'
        />
        <FormInput 
          label='Cantidad'
          name='quantity'
          idInput='quantity'
          value={formData.quantity.toString()}
          onChange={handleChange}
          type='number'
        />
        <FormSelectInput
          label='Categoría'
          selectName='categoriId'
          selectId='categoriId'
          value={formData.categoriId?.toString()}
          onChange={handleChange}
          options={[
            { name: 'Electrónica', value: 1 },
            { name: 'Hogar', value: 2 },
            { name: 'Oficina', value: 3 },
          ]}
        />
        <div>
          <Button type='submit' variant='primary' label='Crear Producto' />
        </div>
      </Form>
    </>
  );

  return (
    <Modal 
      isOpen={productModal.isOpen}
      onClose={productModal.onClose}
      title='Crear Producto'
      body={productModalBody}
    />
  )
}

export default ProductModal