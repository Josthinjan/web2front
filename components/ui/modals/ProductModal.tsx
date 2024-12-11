"use client";
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useProductModal } from '@/hooks/modals/useProductModal';
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
  
  // Fetch de datos para categorías y etiquetas
  const { data: tagData, loading: tagLoading, error: tagError } = useFetch({
    url: 'api/tags',
  });

  const { data: categoryData, loading: categoryLoading, error: categoryError } = useFetch({
    url: 'api/categories',
  });

  // Transformar los datos de categorías y etiquetas en el formato adecuado para los select
  const newCategoryData = categoryData?.map((category: any) => ({
    name: category.name,
    value: category.id,
  }));

  const newTagData = tagData?.map((tag: any) => ({
    name: tag.name,
    value: tag.id,
  }));

  // Estado del formulario (inicializamos tagId y categoriId con 0 en lugar de null)
  const [formData, setFormData] = useState<IProducts>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    tagId: 0, // Inicializado a 0 en lugar de null
    categoriId: 0, // Inicializado a 0 en lugar de null
  });

  // Si estamos editando un producto, precargar los datos
  useEffect(() => {
    if (productModal.productToEdit) {
      setFormData({
        id: productModal.productToEdit.id,
        name: productModal.productToEdit.name,
        description: productModal.productToEdit.description,
        price: productModal.productToEdit.price,
        quantity: productModal.productToEdit.quantity,
        tagId: productModal.productToEdit.tagId ?? 0, // Asignar 0 si no hay tag
        categoriId: productModal.productToEdit.categoriId ?? 0, // Asignar 0 si no hay categoría
      });
    }
  }, [productModal.productToEdit]);

  // Restablecer formData al cerrar el modal cuando no hay producto para editar
  useEffect(() => {
    if (!productModal.isOpen) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        tagId: 0,
        categoriId: 0,
      });
    }
  }, [productModal.isOpen]);

  // Enviar formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);

    // Lógica para enviar los datos al backend (crear o actualizar)
    if (productModal.productToEdit) {
      // Lógica de actualización
      console.log('Producto actualizado:', formData);
    } else {
      // Lógica de creación
      console.log('Producto creado:', formData);
    }
    productModal.onClose(); // Cerrar el modal después de crear o actualizar el producto
  };

  // Manejo de cambios en el formulario
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    // Convertir a número si el campo es 'price', 'quantity', 'tagId' o 'categoriId'
    setFormData({
      ...formData,
      [name]: ['price', 'quantity', 'tagId', 'categoriId'].includes(name)
        ? Number(value) // Convertimos a número
        : value, // Mantener como string
    });
  };

  const productModalBody = (
    <>
      {tagLoading && <Label text="Cargando etiquetas..." type="info" />}
      {tagError && <Label text="Error al cargar etiquetas" type="error" />}
      <Form onSubmit={handleSubmit}>
        <FormInput
          label="Nombre del producto"
          name="name"
          idInput="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
        />
        <FormSelectInput
          label="Etiqueta"
          selectName="tagId"
          selectId="tagId"
          value={formData.tagId.toString()} // Aseguramos que sea un string en el select
          onChange={handleChange}
          options={newTagData}
        />
        <FormInput
          label="Descripción"
          name="description"
          idInput="description"
          value={formData.description}
          onChange={handleChange}
          type="text"
        />
        <FormInput
          label="Precio"
          name="price"
          idInput="price"
          value={formData.price.toString()} // Aseguramos que sea un string en el input
          onChange={handleChange}
          type="number"
        />
        <FormInput
          label="Cantidad"
          name="quantity"
          idInput="quantity"
          value={formData.quantity.toString()} // Aseguramos que sea un string en el input
          onChange={handleChange}
          type="number"
        />
        <FormSelectInput
          label="Categoría"
          selectName="categoriId"
          selectId="categoriId"
          value={formData.categoriId.toString()} // Aseguramos que sea un string en el select
          onChange={handleChange}
          options={newCategoryData}
        />
        <div>
          <Button type="submit" variant="primary" label={productModal.productToEdit ? "Actualizar Producto" : "Crear Producto"} />
        </div>
      </Form>
    </>
  );

  return (
    <Modal
      isOpen={productModal.isOpen}
      onClose={productModal.onClose}
      title={productModal.productToEdit ? "Editar Producto" : "Crear Producto"}
      body={productModalBody}
    />
  );
};

export default ProductModal;
