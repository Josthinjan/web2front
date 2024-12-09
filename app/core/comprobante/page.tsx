"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Table from "@/components/shared/Table/Table";

// Función para obtener los comprobantes del backend con paginación
const fetchComprobantes = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/comprobantes-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al obtener los comprobantes");
  }
  const data = await response.json();
  return data;
};

// Función para obtener datos adicionales
const fetchAdditionalData = async () => {
  const token = getTokenFromCookie();
  const [usuariosResponse, productosResponse, lotesResponse] =
    await Promise.all([
      fetch(`${config.API_BASE_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${config.API_BASE_URL}/productos`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${config.API_BASE_URL}/lotes`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

  if (usuariosResponse.ok && productosResponse.ok && lotesResponse.ok) {
    const usuariosData = await usuariosResponse.json();
    const productosData = await productosResponse.json();
    const lotesData = await lotesResponse.json();
    return { usuariosData, productosData, lotesData };
  } else {
    throw new Error("Error al obtener datos adicionales");
  }
};

// Función para descargar el comprobante en PDF
const downloadComprobantePDF = async (id: number) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/comprobante/${id}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `comprobante_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } else {
    Swal.fire("Error", "No se pudo descargar el comprobante.", "error");
  }
};


const comprobantesData = [
  {
    fechaEmision: "2024-12-01",
    codigoLote: "L001",
    nombreUsuario: "Juan Pérez",
    nombreProducto: "Cámara Digital",
    cantidad: 1,
    precioTotal: "$450.00",
    estado: "Pagado",
  },
  {
    fechaEmision: "2024-12-02",
    codigoLote: "L002",
    nombreUsuario: "Ana Gómez",
    nombreProducto: "Smartphone",
    cantidad: 2,
    precioTotal: "$900.00",
    estado: "Pendiente",
  },
  {
    fechaEmision: "2024-12-03",
    codigoLote: "L003",
    nombreUsuario: "Carlos López",
    nombreProducto: "Auriculares Bluetooth",
    cantidad: 3,
    precioTotal: "$150.00",
    estado: "Pagado",
  },
  {
    fechaEmision: "2024-12-04",
    codigoLote: "L004",
    nombreUsuario: "Laura Martínez",
    nombreProducto: "Laptop Gaming",
    cantidad: 1,
    precioTotal: "$1200.00",
    estado: "Pagado",
  },
  {
    fechaEmision: "2024-12-05",
    codigoLote: "L005",
    nombreUsuario: "Pedro Fernández",
    nombreProducto: "Tablet 10 pulgadas",
    cantidad: 2,
    precioTotal: "$400.00",
    estado: "Pendiente",
  },
  {
    fechaEmision: "2024-12-06",
    codigoLote: "L006",
    nombreUsuario: "Marta Rodríguez",
    nombreProducto: "Smartwatch",
    cantidad: 1,
    precioTotal: "$250.00",
    estado: "Pagado",
  },
  {
    fechaEmision: "2024-12-07",
    codigoLote: "L007",
    nombreUsuario: "Luis Pérez",
    nombreProducto: "Teclado Mecánico",
    cantidad: 2,
    precioTotal: "$220.00",
    estado: "Pendiente",
  }
];


const ComprobantesPage = () => {
  const [comprobantes, setComprobantes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("fecha_emision");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [usuarios, setUsuarios] = useState<any>({});
  const [productos, setProductos] = useState<any>({});
  const [lotes, setLotes] = useState<any>({});
  const rowsPerPage = 5; // Número de filas por página


  useEffect(() => {
    const loadComprobantes = async () => {
      try {
        const data = await fetchComprobantes(currentPage, sortField, sortOrder);
        const { usuariosData, productosData, lotesData } =
          await fetchAdditionalData();

        // Convertir los arrays a objetos para un acceso más rápido
        const usuariosMap = usuariosData.reduce((acc: any, usuario: any) => {
          acc[usuario.id] = usuario.nombre;
          return acc;
        }, {});
        const productosMap = productosData.reduce((acc: any, producto: any) => {
          acc[producto.id_producto] = producto.nombre_producto;
          return acc;
        }, {});
        const lotesMap = lotesData.reduce((acc: any, lote: any) => {
          acc[lote.id_lote] = lote.codigo_lote;
          return acc;
        }, {});

        const updatedComprobantes = data.data.map((comprobante: any) => ({
          ...comprobante,
          usuarioNombre: usuariosMap[comprobante.usuario_id] || "Desconocido",
          productoNombre:
            productosMap[comprobante.id_producto] || "Desconocido",
          loteCodigo: lotesMap[comprobante.id_lote] || "Desconocido",
        }));

        setComprobantes(updatedComprobantes);
        setTotalPages(data.last_page);
        setUsuarios(usuariosMap);
        setProductos(productosMap);
        setLotes(lotesMap);
      } catch (err) {
        setError("Error al cargar los comprobantes.");
      } finally {
        setLoading(false);
      }
    };

    loadComprobantes();
  }, [currentPage, sortField, sortOrder]);

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getPaginatedData = () => {
    return comprobantesData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  };

   // Funciones de edición y eliminación
   const handleEditProduct = (product: Record<string, any>) => {
    console.log("Edit product:", product);
  };

  const handleDeleteProduct = (id: number) => {
    console.log("Delete product with ID:", id);
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Comprobantes</h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">
            Lista de Comprobantes
          </h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
          <Table
              data={getPaginatedData()}
              columns={8}
              rowsPerPage={rowsPerPage}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
            {/* Paginación */}
            <div className="flex justify-between mt-4 w-full">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="font-semibold">{currentPage} / {totalPages}</span>
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

export default ComprobantesPage;
