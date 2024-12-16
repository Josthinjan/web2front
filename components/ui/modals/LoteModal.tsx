import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useLoteModal } from "@/hooks/modals/useLoteModal";
import { ILote } from "@/interfaces/ILote";
import { ISite } from "@/interfaces/ISite";
import { IProducts } from "@/interfaces/IProducts";
import { IProvider } from "@/interfaces/IProvider";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Swal from "sweetalert2";
import { config } from "@/config/config";

// Definir las propiedades que recibe LoteModal
interface LoteModalProps {
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoteModal: React.FC<LoteModalProps> = ({ setShouldRefetch }) => {
  const loteModal = useLoteModal();
  const [formData, setFormData] = useState<ILote>({
    id_lote: 0,
    id_producto: 0,
    id_proveedor: 0,
    id_sitio: 0,
    codigo_lote: "",
    fecha_fabricacion: "",
    fecha_caducidad: "",
    cantidad: 0,
    expirable: false,
    created_at: "",
    updated_at: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usar useFetch para cargar los datos de sitios, productos y proveedores
  const { data: sitiosResponse } = useFetch<{ data: ISite[] }>({ url: "/sitios" });
  const { data: productos } = useFetch<IProducts[]>({ url: "/productos" });
  const { data: proveedores } = useFetch<IProvider[]>({ url: "/proveedores" });

  const sitios = sitiosResponse?.data || [];

  useEffect(() => {
    if (loteModal.loteToEdit) {
      setFormData({
        ...loteModal.loteToEdit,
      });
    } else {
      setFormData({
        id_lote: 0,
        id_producto: 0,
        id_proveedor: 0,
        id_sitio: 0,
        codigo_lote: "",
        fecha_fabricacion: "",
        fecha_caducidad: "",
        cantidad: 0,
        expirable: false,
        created_at: "",
        updated_at: "",
      });
    }
  }, [loteModal.loteToEdit]);

  const { data, error, loading, refetch } = useFetch<ILote>({
    url: loteModal.loteToEdit
      ? `/lotes/${loteModal.loteToEdit.id_lote}`
      : "/lotes",
    method: loteModal.loteToEdit ? "PUT" : "POST",
    body: JSON.stringify({
      ...formData,
      id_producto: Number(formData.id_producto),
      id_proveedor: Number(formData.id_proveedor),
      id_sitio: Number(formData.id_sitio),
      cantidad: Number(formData.cantidad),
    }),
    skipToken: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.codigo_lote ||
      !formData.id_producto ||
      !formData.id_proveedor ||
      !formData.id_sitio ||
      !formData.fecha_fabricacion ||
      !formData.fecha_caducidad
    ) {
      Swal.fire("Error", "Por favor, completa todos los campos correctamente.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Si no hay error, procesar la solicitud
      const response = await refetch();

      if (error) {
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
        return;
      }

      // Si los datos se procesan correctamente
      if (data) {
        Swal.fire("Éxito", loteModal.loteToEdit ? "Lote actualizado correctamente" : "Lote creado correctamente", "success");

        setShouldRefetch(true);
        loteModal.onClose();
      }
    } catch (err) {
      console.error("Error al procesar la solicitud:", err);
      Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "id_producto" || name === "id_proveedor" || name === "id_sitio" || name === "cantidad"
        ? parseInt(value, 10)
        : value,
    }));
  };

  const renderSelectOptions = (data: any[], valueKey: string, nameKey: string) => {
    return Array.isArray(data)
      ? data.map((item) => ({ value: item[valueKey].toString(), name: item[nameKey] }))
      : [];
  };

  const loteModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Código de Lote"
        name="codigo_lote"
        idInput="codigo_lote"
        value={formData.codigo_lote}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Fecha de Fabricación"
        name="fecha_fabricacion"
        idInput="fecha_fabricacion"
        value={formData.fecha_fabricacion}
        onChange={handleChange}
        type="date"
      />
      <FormInput
        label="Fecha de Caducidad"
        name="fecha_caducidad"
        idInput="fecha_caducidad"
        value={formData.fecha_caducidad}
        onChange={handleChange}
        type="date"
      />
      <FormInput
        label="Cantidad"
        name="cantidad"
        idInput="cantidad"
        value={formData.cantidad.toString()}
        onChange={handleChange}
        type="number"
      />
      <FormSelectInput
        label="Producto"
        selectName="id_producto"
        selectId="id_producto"
        value={formData.id_producto.toString()}
        onChange={handleChange}
        options={productos ? renderSelectOptions(productos, "id_producto", "nombre_producto") : []}
      />
      <FormSelectInput
        label="Proveedor"
        selectName="id_proveedor"
        selectId="id_proveedor"
        value={formData.id_proveedor.toString()}
        onChange={handleChange}
        options={proveedores ? renderSelectOptions(proveedores, "id_proveedor", "nombre") : []}
      />
      <FormSelectInput
        label="Sitio"
        selectName="id_sitio"
        selectId="id_sitio"
        value={formData.id_sitio.toString()}
        onChange={handleChange}
        options={sitios ? renderSelectOptions(sitios, "id_sitio", "nombre_sitio") : []}
      />
      <div className="flex items-center">
        <label className="mr-2">Lote Expirable</label>
        <input
          type="checkbox"
          name="expirable"
          checked={formData.expirable}
          onChange={(e) => setFormData({ ...formData, expirable: e.target.checked })}
        />
      </div>
      <div>
        <Button
          type="submit"
          variant="primary"
          label={loteModal.loteToEdit ? "Actualizar Lote" : "Crear Lote"}
          isDisabled={isSubmitting}
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={loteModal.isOpen}
      onClose={loteModal.onClose}
      title={loteModal.loteToEdit ? "Editar Lote" : "Crear Lote"}
      body={loteModalBody}
    />
  );
};

export default LoteModal;


