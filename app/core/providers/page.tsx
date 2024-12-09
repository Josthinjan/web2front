'use client';
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import Label from "@/components/ui/label/Label";
import { useProviderModal } from "@/hooks/modals/useProviderModal";
import ProviderModal from "@/components/ui/modals/ProviderModal";
import Table from "@/components/shared/Table/Table";

// Datos quemados de proveedores
const providers = [
  { 
    id: 1, 
    name: 'Proveedor Tecnología', 
    email: 'tech@example.com', 
    phone: '555-1234', 
    address: 'Av. Tecnológica 123', 
    city: 'Ciudad Tech', 
    status: 'Activo' 
  },
  { 
    id: 2, 
    name: 'Proveedor Alimentos', 
    email: 'food@example.com', 
    phone: '555-5678', 
    address: 'Calle Gastronómica 456', 
    city: 'Ciudad Gourmet', 
    status: 'Inactivo' 
  },
  { 
    id: 3, 
    name: 'Proveedor Diseño', 
    email: 'design@example.com', 
    phone: '555-9012', 
    address: 'Paseo Creativo 789', 
    city: 'Ciudad Artística', 
    status: 'Activo' 
  },
  { 
    id: 4, 
    name: 'Proveedor Logística', 
    email: 'logistics@example.com', 
    phone: '555-3456', 
    address: 'Ruta Comercial 321', 
    city: 'Ciudad Conexión', 
    status: 'Activo' 
  },
  { 
    id: 5, 
    name: 'Proveedor Consultoría', 
    email: 'consulting@example.com', 
    phone: '555-7890', 
    address: 'Torre Empresarial 654', 
    city: 'Ciudad Negocios', 
    status: 'Inactivo' 
  }
];

const ProvidersPage = () => {
  const providerModal = useProviderModal();
  const [proveedores, setProveedores] = useState<any[]>(providers);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1); // Inicializamos con 1

  const rowsPerPage = 5; // Establece la cantidad de filas por página

  // Calcular el número total de páginas basado en la cantidad de proveedores
  useEffect(() => {
    const totalProviders = proveedores.length;
    const pages = Math.ceil(totalProviders / rowsPerPage);
    setTotalPages(pages);
  }, [proveedores]);

  // Obtener datos paginados
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return proveedores.slice(startIndex, endIndex);
  };

  // Mostrar formulario de nuevo proveedor
  const handleAddNewProvider = () => {
    providerModal.onOpen();
  };

  // Enviar datos del proveedor al backend (placeholder)
  const handleSubmitProveedor = async (proveedorData: any) => {
    try {
      // Lógica de backend simulada
      const nuevoProv = {
        ...proveedorData,
        id: proveedores.length + 1
      };
      
      setProveedores([...proveedores, nuevoProv]);
      Swal.fire("Éxito", "Proveedor creado correctamente", "success");
      providerModal.onClose();
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al crear el proveedor", "error");
    }
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar proveedor
  const handleDeleteProvider = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProveedores(proveedores.filter(provider => provider.id !== id));
          Swal.fire("Eliminado", "Proveedor eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el proveedor", "error");
        }
      }
    });
  };

  // Editar proveedor
  const handleEditProvider = (provider: any) => {
    providerModal.onOpen();
    // En tu hook de modal, necesitarás agregar soporte para pasar el proveedor a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Proveedores</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Proveedor"
            type="button"
            variant="primary"
            onClick={handleAddNewProvider}
          />
        </div>
        <ProviderModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Proveedores Disponibles</h2>
          {loading && <Label type="info" text="Cargando proveedores" />}
          {error && <Label type="error" text={error} />}
          
          {!loading && !error && proveedores.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={6}
                rowsPerPage={5}
                onEdit={handleEditProvider}
                onDelete={handleDeleteProvider}
              />
              <div className="flex justify-between mt-4 w-full">
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
            </>
          ) : (
            !loading && <Label type="info" text="No hay proveedores para mostrar." />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProvidersPage;
