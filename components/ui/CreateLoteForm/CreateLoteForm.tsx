import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import FormCheckbox from "@/components/shared/Form/FormCheckbox";
import Button from "@/components/shared/Button/Button";
import React, { useState, useEffect } from "react";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';

const CreateLoteForm: React.FC<{ onSubmit: (formData: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    productId: "",
    providerId: "",
    siteId: "", // Agregado para el sitio
    manufactoringDate: "",
    expirationDate: "",
    quantity: "",
    isExpirable: false,
  });

  const [productsData, setProductsData] = useState<{ id_producto: number; nombre_producto: string }[]>([]);
  const [providersData, setProvidersData] = useState<{ id_proveedor: number; nombre: string }[]>([]);
  const [sitesData, setSitesData] = useState<{ id_sitio: number; nombre_sitio: string }[]>([]);

  // Fetch de datos de productos, proveedores y sitios
  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromCookie();
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      try {
        const productsResponse = await fetch(`${config.API_BASE_URL}/productos`, { headers });
        const products = await productsResponse.json();
        setProductsData(products);

        const providersResponse = await fetch(`${config.API_BASE_URL}/proveedores`, { headers });
        const providers = await providersResponse.json();
        setProvidersData(providers);

        const sitesResponse = await fetch(`${config.API_BASE_URL}/sitios`, { headers });
        const sites = await sitesResponse.json();
        setSitesData(sites);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Maneja el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id_producto: formData.productId,
      id_proveedor: formData.providerId,
      id_sitio: formData.siteId,
      fecha_fabricacion: formData.manufactoringDate,
      fecha_caducidad: formData.expirationDate,
      cantidad: Number(formData.quantity),
      expirable: formData.isExpirable,
      isActive: true
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center font-bold text-blue-400 mb-5 text-xl">
        Ingresar lotes por formulario
      </div>
      <FormSelectInput
        selectId="productId"
        label="Producto"
        selectName="productId"
        value={formData.productId}
        options={productsData.map(product => ({ name: product.nombre_producto, value: product.id_producto }))}
        onChange={handleChange}
      />
      <FormSelectInput
        selectId="providerId"
        label="Proveedor"
        selectName="providerId"
        value={formData.providerId}
        options={providersData.map(provider => ({ name: provider.nombre, value: provider.id_proveedor }))}
        onChange={handleChange}
      />
      <FormSelectInput
        selectId="siteId"
        label="Sitio"
        selectName="siteId"
        value={formData.siteId}
        options={sitesData.map(site => ({ name: site.nombre_sitio, value: site.id_sitio }))}
        onChange={handleChange}
      />
      <FormInput
        idInput="manufactoringDate"
        label="Fecha de fabricación"
        name="manufactoringDate"
        type="date"
        value={formData.manufactoringDate}
        onChange={handleChange}
      />
      {formData.isExpirable && (
        <FormInput
          idInput="expirationDate"
          label="Fecha de expiración"
          name="expirationDate"
          type="date"
          value={formData.expirationDate}
          onChange={handleChange}
        />
      )}
      <FormInput
        idInput="quantity"
        label="Cantidad"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
      />
      <FormCheckbox
        label="Es expirable"
        idCheckbox="isExpirable"
        nameCheckbox="isExpirable" // Asegúrate de que el nombre sea consistente
        checked={formData.isExpirable}
        onChange={handleChange}
      />
      <div>
        <Button label="Crear Lote" type="submit" variant="primary" />
      </div>
    </Form>
  );
};

export default CreateLoteForm;
