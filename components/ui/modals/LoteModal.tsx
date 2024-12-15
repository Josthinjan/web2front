import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useLoteModal } from "@/hooks/modals/useLoteModal";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import FormSelectInput from "@/components/shared/Form/selectElement/FormSelectInput";
import Button from "@/components/shared/Button/Button";
import Swal from "sweetalert2";
import { ILote } from "@/interfaces/ILote";
import { useFetch } from "@/hooks/useFetch";
import { config } from "@/config/config";

const LoteModal = ({ setShouldRefetch }: { setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const loteModal = useLoteModal();
  const [formData, setFormData] = useState<ILote>({
    id_producto: 0,
    id_proveedor: 0,
    id_sitio: 0,
    fecha_fabricacion: "",
    fecha_caducidad: "",
    cantidad: 0,
    expirable: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sitios, setSitios] = useState<{ id: number; nombre: string }[]>([]);
  const [productos, setProductos] = useState<{ id: number; nombre: string }[]>([]);
  const [proveedores, setProveedores] = useState<{ id: number; nombre: string }[]>([]);

  const [loadingSitios, setLoadingSitios] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingProveedores, setLoadingProveedores] = useState(true);

  useEffect(() => {
    if (loteModal.loteToEdit) {
      setFormData(loteModal.loteToEdit);
    } else {
      setFormData({
        id_producto: 0,
        id_proveedor: 0,
        id_sitio: 0,
        fecha_fabricacion: "",
        fecha_caducidad: "",
        cantidad: 0,
        expirable: false,
      });
    }
  }, [loteModal.loteToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token") || document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
        const tenant = sessionStorage.getItem("X_Tenant");

        if (!tenant) {
          Swal.fire("Error", "El tenant no está especificado", "error");
          return;
        }

        const headers: HeadersInit = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          "X-Tenant": tenant,
        };

        const [sitiosResponse, productosResponse, proveedoresResponse] = await Promise.all([
          fetch(`${config.API_BASE_URL}/sitios`, { headers }),
          fetch(`${config.API_BASE_URL}/productos`, { headers }),
          fetch(`${config.API_BASE_URL}/proveedores`, { headers }),
        ]);

        const sitiosData = await sitiosResponse.json();
        const productosData = await productosResponse.json();
        const proveedoresData = await proveedoresResponse.json();

        setSitios(Array.isArray(sitiosData) ? sitiosData : []);
        setProductos(Array.isArray(productosData) ? productosData : []);
        setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setSitios([]);
        setProductos([]);
        setProveedores([]);
      } finally {
        setLoadingSitios(false);
        setLoadingProductos(false);
        setLoadingProveedores(false);
      }
    };

    fetchData();
  }, []);

  const url = loteModal.loteToEdit
    ? `/api/lotes/${loteModal.loteToEdit.id_lote}`
    : `/api/lotes`;

  const { data, error, loading, refetch } = useFetch<ILote>({
    url,
    method: loteModal.loteToEdit ? "PUT" : "POST",
    body: JSON.stringify(formData),
    skipToken: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.id_sitio || !formData.fecha_fabricacion || !formData.fecha_caducidad || !formData.cantidad) {
      Swal.fire("Error", "Por favor, completa todos los campos.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await refetch();

      if (error) {
        throw new Error(error.message || "Error al guardar el lote.");
      }

      Swal.fire(
        "Éxito",
        loteModal.loteToEdit ? "Lote actualizado correctamente" : "Lote creado correctamente",
        "success"
      );

      setShouldRefetch(true);
      loteModal.onClose();
    } catch (err) {
      Swal.fire("Error", err.message || "Ocurrió un problema.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "expirable" ? value === "true" : parseInt(value),
    }));
  };

  const loteModalBody = (
    <Form onSubmit={handleSubmit}>
      {/* Check if sitios, productos, and proveedores are loaded properly */}
      <FormSelectInput
        label="Sitio"
        selectName="id_sitio"
        selectId="id_sitio"
        value={formData.id_sitio.toString()}
        onChange={handleChange}
        options={loadingSitios || !sitios.length ? [] : sitios.map((sitio) => ({ value: sitio.id.toString(), name: sitio.nombre }))}
      />
      <FormSelectInput
        label="Producto"
        selectName="id_producto"
        selectId="id_producto"
        value={formData.id_producto.toString()}
        onChange={handleChange}
        options={loadingProductos || !productos.length ? [] : productos.map((producto) => ({ value: producto.id.toString(), name: producto.nombre }))}
      />
      <FormSelectInput
        label="Proveedor"
        selectName="id_proveedor"
        selectId="id_proveedor"
        value={formData.id_proveedor.toString()}
        onChange={handleChange}
        options={loadingProveedores || !proveedores.length ? [] : proveedores.map((proveedor) => ({ value: proveedor.id.toString(), name: proveedor.nombre }))}
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
        label="Fecha de Expiración"
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
        value={formData.cantidad}
        onChange={handleChange}
        type="number"
      />
      <FormSelectInput
        label="¿Es Expirable?"
        selectName="expirable"
        selectId="expirable"
        value={formData.expirable ? "true" : "false"}
        onChange={handleChange}
        options={[
          { value: "true", name: "Sí" },
          { value: "false", name: "No" },
        ]}
      />
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
