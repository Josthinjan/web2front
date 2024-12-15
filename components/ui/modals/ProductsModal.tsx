import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useProductsModal } from "@/hooks/modals/useProductsModal"; // Nuevo hook
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";
import Swal from "sweetalert2";
import { IProducts } from "@/interfaces/IProducts"; // Nueva interfaz para productos
import { useFetch } from "@/hooks/useFetch";

const ProductModal = ({ setShouldRefetch }: { setShouldRefetch?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const productModal = useProductsModal(); // Usamos el hook para productos
  const [formData, setFormData] = useState<IProducts>({
    nombre_producto: "",
    tipo_producto: "",
    descripcion_producto: "",
    precio: 0,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (productModal.productToEdit) {
      setFormData({
        id_producto: productModal.productToEdit.id_producto,
        nombre_producto: productModal.productToEdit.nombre_producto || "",
        tipo_producto: productModal.productToEdit.tipo_producto || "",
        descripcion_producto: productModal.productToEdit.descripcion_producto || "",
        precio: productModal.productToEdit.precio || 0,
        isActive: productModal.productToEdit.isActive || true,
      });
    } else {
      setFormData({
        nombre_producto: "",
        tipo_producto: "",
        descripcion_producto: "",
        precio: 0,
        isActive: true,
      });
    }
  }, [productModal.productToEdit]);

  const url = productModal.productToEdit
    ? `/productos/${productModal.productToEdit.id_producto}`
    : `/productos`;

  const { data, error, loading, refetch } = useFetch<IProducts>({
    url,
    method: productModal.productToEdit ? "PUT" : "POST",
    body: JSON.stringify(formData),
    skipToken: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nombre_producto || !formData.tipo_producto || !formData.descripcion_producto || formData.precio <= 0) {
      Swal.fire("Error", "Por favor, completa todos los campos correctamente.", "error");
      return;
    }

    // Si ya estamos enviando, no permitir enviar de nuevo
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Hacer la solicitud
      const response = await refetch();

      if (error) {
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
        return;
      }

      if (data) {
        Swal.fire(
          "Éxito",
          productModal.productToEdit ? "Producto actualizado correctamente" : "Producto creado correctamente",
          "success"
        );

        // Si setShouldRefetch está disponible, indicamos que es necesario hacer un refetch
        setShouldRefetch?.(true);

        // Cerrar el modal después de una acción exitosa
        productModal.onClose();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ocurrió un error");
      Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const productModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre del Producto"
        name="nombre_producto"
        idInput="nombre_producto"
        value={formData.nombre_producto}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Tipo de Producto"
        name="tipo_producto"
        idInput="tipo_producto"
        value={formData.tipo_producto}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Descripción del Producto"
        name="descripcion_producto"
        idInput="descripcion_producto"
        value={formData.descripcion_producto}
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
      <div className="w-full py-6">
        <Button
          type="submit"
          variant="primary"
          label={productModal.productToEdit ? "Actualizar Producto" : "Crear Producto"}
          isDisabled={isSubmitting}
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={productModal.isOpen}
      onClose={productModal.onClose}
      title={productModal.productToEdit ? "Editar Producto" : "Crear Nuevo Producto"}
      body={productModalBody}
    />
  );
};

export default ProductModal;
