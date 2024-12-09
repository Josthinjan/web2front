"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Label from "@/components/ui/label/Label";
import Table from "@/components/shared/Table/Table";

// Función para obtener las facturas del backend con paginación
const fetchFacturas = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/facturas-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al obtener las facturas");
  }
  const data = await response.json();
  return data;
};

// Función para obtener datos adicionales
const fetchAdditionalData = async () => {
  const token = getTokenFromCookie();
  const [usuariosResponse, metodosPagoResponse] = await Promise.all([
    fetch(`${config.API_BASE_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${config.API_BASE_URL}/metodos-pago`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (usuariosResponse.ok && metodosPagoResponse.ok) {
    const usuariosData = await usuariosResponse.json();
    const metodosPagoData = await metodosPagoResponse.json();
    return { usuariosData, metodosPagoData };
  } else {
    throw new Error("Error al obtener datos adicionales");
  }
};

// Función para descargar la factura en PDF
const downloadFacturaPDF = async (id: number) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/factura/${id}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `factura_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } else {
    Swal.fire("Error", "No se pudo descargar la factura.", "error");
  }
};


const paymentData = [
  {
    fechaPago: "2024-12-01",
    usuario: "Juan Pérez",
    metodoPago: "Tarjeta de Crédito",
    orderId: "ORD123456",
    orderIdPaypal: "PP-1234567890",
    total: "$120.00",
    estado: "Pagado",
    acciones: "Editar | Eliminar",
  },
  {
    fechaPago: "2024-12-02",
    usuario: "Ana Gómez",
    metodoPago: "PayPal",
    orderId: "ORD123457",
    orderIdPaypal: "PP-9876543210",
    total: "$45.50",
    estado: "Pendiente",
    acciones: "Editar | Eliminar",
  },
  {
    fechaPago: "2024-12-03",
    usuario: "Carlos López",
    metodoPago: "Transferencia Bancaria",
    orderId: "ORD123458",
    orderIdPaypal: "PP-1122334455",
    total: "$300.00",
    estado: "Pendiente",
    acciones: "Editar | Eliminar",
  },
  {
    fechaPago: "2024-12-04",
    usuario: "Laura Martínez",
    metodoPago: "Tarjeta de Crédito",
    orderId: "ORD123459",
    orderIdPaypal: "PP-5566778899",
    total: "$75.99",
    estado: "Pagado",
    acciones: "Editar | Eliminar",
  },
  {
    fechaPago: "2024-12-05",
    usuario: "Pedro Fernández",
    metodoPago: "PayPal",
    orderId: "ORD123460",
    orderIdPaypal: "PP-6677889900",
    total: "$250.75",
    estado: "Pendiente",
    acciones: "Editar | Eliminar",
  },
  {
    fechaPago: "2024-12-06",
    usuario: "Marta Rodríguez",
    metodoPago: "Tarjeta de Crédito",
    orderId: "ORD123461",
    orderIdPaypal: "PP-9988776655",
    total: "$195.20",
    estado: "Pagado",
    acciones: "Editar | Eliminar",
  },
  {
    fechaPago: "2024-12-07",
    usuario: "Luis Pérez",
    metodoPago: "Transferencia Bancaria",
    orderId: "ORD123462",
    orderIdPaypal: "PP-2233445566",
    total: "$500.00",
    estado: "Pendiente",
    acciones: "Editar | Eliminar",
  }
];


const FacturasPage = () => {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("fecha_pago");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [usuarios, setUsuarios] = useState<any>({});
  const [metodosPago, setMetodosPago] = useState<any>({});
  const rowsPerPage = 5; // Número de filas por página


  useEffect(() => {
    const loadFacturas = async () => {
      try {
        const data = await fetchFacturas(currentPage, sortField, sortOrder);
        const { usuariosData, metodosPagoData } = await fetchAdditionalData();

        // Convertir los arrays a objetos para un acceso más rápido
        const usuariosMap = usuariosData.reduce((acc: any, usuario: any) => {
          acc[usuario.id] = usuario.nombre;
          return acc;
        }, {});
        const metodosPagoMap = metodosPagoData.reduce(
          (acc: any, metodo: any) => {
            acc[metodo.id] = metodo.nombre;
            return acc;
          },
          {}
        );

        const updatedFacturas = data.data.map((factura: any) => ({
          ...factura,
          usuarioNombre: usuariosMap[factura.usuario_id] || "Desconocido",
          metodoPagoNombre:
            metodosPagoMap[factura.metodo_pago_id] || "Desconocido",
        }));

        setFacturas(updatedFacturas);
        setTotalPages(data.last_page);
        setUsuarios(usuariosMap);
        setMetodosPago(metodosPagoMap);
      } catch (err) {
        setError("Error al cargar las facturas.");
      } finally {
        setLoading(false);
      }
    };

    loadFacturas();
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
    return paymentData.slice(
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
          <h1 className="text-2xl font-bold">Administración de Facturas</h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">
            Lista de Facturas
          </h2>
          {loading && <Label type="info" text="Cargando facturas" />}
          {error && <Label type="error" text={error} />}
          {/* Tabla de facturas */}
          <Button type="button" variant="primary" label="Agregar factura" onClick={() => {}}/>
          <div className="overflow-x-auto">
          <Table
              data={getPaginatedData()}
              columns={5}
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

export default FacturasPage;
