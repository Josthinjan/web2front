"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CreateProviderForm from "@/components/ui/CreateProvidersForm/CreateProvidersForm";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';
import Label from "@/components/ui/label/Label";
import ProviderModal from "@/components/ui/modals/ProviderModal";
import { useProviderModal } from "@/hooks/modals/useProviderModal";
// Función para obtener los datos de proveedores del backend con paginación y ordenación
const fetchProviders = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/proveedores-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    throw new Error('Error al obtener los proveedores');
  }
  const data = await response.json();
  return data;
};

const ProvidersPage = () => {
  const providerModal = useProviderModal();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("nombre");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchProviders(currentPage, sortField, sortOrder);
        setProviders(data.data);
        setTotalPages(data.last_page);
      } catch (err) {
        setError("Error al cargar los proveedores.");
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [currentPage, sortField, sortOrder]); // Recargar cuando cambie la página, el campo de orden o el orden

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateProvider = async (providerData: any) => {
    const token = getTokenFromCookie();
    const response = await fetch(`${config.API_BASE_URL}/proveedor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(providerData),

    });
    //console log del json que se envia
    console.log(JSON.stringify(providerData));
    if (response.ok) {
      Swal.fire("Éxito", "Proveedor creado con éxito.", "success");
      providerModal.onClose();
      // Volver a cargar proveedores después de agregar uno nuevo
      const data = await fetchProviders(currentPage, sortField, sortOrder);
      setProviders(data.data);
      setTotalPages(data.last_page);
    } else {
      Swal.fire("Error", "Error al crear el proveedor.", "error");
      console.log(response);
    }
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administración de Proveedores</h1>
        </div>
        {error && <Label type="error" text='Error al cargar proveedores '/>}
        {loading && <Label type="info" text='Cargando proveedores...'/>}

        <ProviderModal />

        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Proveedores Disponibles</h2>
          <div className=" flex mb-3">
            <Button
              label="Agregar Proveedor"
              type="button"
              variant="primary"
              onClick={providerModal.onOpen}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("nombre")}
                  >
                    Nombre {sortField === "nombre" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Dirección</th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Teléfono</th>
                  <th className="px-4 py-2 border-b">Ciudad</th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("Activo")}
                  >
                    Estado {sortField === "Activo" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider.id_proveedor} className="text-center">
                    <td className="px-4 py-2 border-b">{provider.nombre}</td>
                    <td className="px-4 py-2 border-b">{provider.direccion || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{provider.email || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{provider.telefono || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{provider.Cuidad || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{provider.Activo ? "Activo" : "Inactivo"}</td>
                    <td className="px-4 py-2 border-b">
                      <Button label="Editar" type="button" variant="outline" onClick={() => { }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProvidersPage;
