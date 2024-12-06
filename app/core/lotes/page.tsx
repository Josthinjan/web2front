"use client";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";

import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import FormCheckbox from "@/components/shared/Form/FormCheckbox";
import Button from "@/components/shared/Button/Button";
import { ILote } from "@/interfaces/ILote";
import { useFetch } from "@/hooks/useFetch";
import { IProducts } from "@/interfaces/IProducts";
import { IProvider } from "@/interfaces/IProvider";
import Label from "@/components/ui/label/Label";
import { useLoteModal } from "@/hooks/modals/useLoteModal";
import LoteModal from "@/components/ui/modals/LoteModal";


const Page = () => {
  const token = "asdasd";
  const loteModal = useLoteModal();
  const [formData, setFormData] = useState<ILote>({
    productId: 0,
    providerId: 0,
    expirationDate: "",
    isExpirable: false,
    manufactoringDate: "",
    loteCode: "",
    quantity: 0,
  });

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useFetch({
    url: `${config.API_BASE_URL}/products`,
    /*   config: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }, */
  });

  const newProductsData = productsData.map((product: IProducts) => {
    return {
      value: product.id,
      name: product.name,
    };
  });

  if (productsError) {
    console.log(productsError);
  }

  const {
    data: providersData,
    loading: providersLoading,
    error: providersError,
  } = useFetch({
    url: `${config.API_BASE_URL}/provider`,
    /*   config: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }, */
  });

  const newProvidersData = providersData.map((provider: IProvider) => {
    return {
      value: provider.id,
      name: provider.name,
    };
  });

  if (providersError) {
    console.log(providersError);
  }

  const {
    data: lotesData,
    loading: lotesLoading,
    error: lotesError,
  } = useFetch({
    url: `${config.API_BASE_URL}/lotes`,
    /*    config: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }, */
  });

  if (lotesError) {
    console.log(lotesError);
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  console.log(productsData);
  console.log(providersData);
  console.log(lotesData);

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        {lotesLoading && <Label type="info" text="Cargando lotes" />}
        {lotesError && <Label type="error" text="Error al cargar lotes" />}
        {productsLoading && <Label type="info" text="Cargando productos" />}
        {productsError && (
          <Label type="error" text="Error al cargar productos" />
        )}
        {providersLoading && <Label type="info" text="Cargando proveedores" />}
        {providersError && (
          <Label type="error" text="Error al cargar proveedores" />
        )}
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Lotes</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Lote"
            type="button"
            variant="primary"
            onClick={loteModal.onOpen}
          />
        </div>
        <LoteModal />
      </div>
      
    </main>
  );
};

export default Page;
