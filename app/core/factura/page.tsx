"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Label from "@/components/ui/label/Label";

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
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("fecha_pago")}
                  >
                    Fecha de Pago{" "}
                    {sortField === "fecha_pago" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Usuario</th>
                  <th className="px-4 py-2 border-b">Método de Pago</th>
                  <th className="px-4 py-2 border-b">Order ID</th>
                  <th className="px-4 py-2 border-b">Order ID PayPal</th>
                  <th className="px-4 py-2 border-b">Total</th>
                  <th className="px-4 py-2 border-b">Estado</th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.length > 0 ? (
                  facturas.map((factura) => (
                    <tr key={factura.id} className="text-center">
                      <td className="px-4 py-2 border-b">
                        {factura.fecha_pago}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {factura.usuarioNombre}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {factura.metodoPagoNombre}
                      </td>
                      <td className="px-4 py-2 border-b">{factura.order_id}</td>
                      <td className="px-4 py-2 border-b">
                        {factura.order_id_paypal}
                      </td>
                      <td className="px-4 py-2 border-b">{factura.total}</td>
                      <td className="px-4 py-2 border-b">{factura.estado}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => downloadFacturaPDF(factura.id)}
                        >
                          Descargar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-2 border-b">
                      No hay facturas disponibles.
                    </td>
                  </tr>
                )}
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

export default FacturasPage;
