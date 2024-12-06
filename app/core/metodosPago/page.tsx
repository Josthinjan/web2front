"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";

// Función para obtener los métodos de pago del backend con paginación
const fetchMetodosPago = async (page = 1, sortField = "", sortOrder = "") => {
  const token = getTokenFromCookie();
  const response = await fetch(
    `${config.API_BASE_URL}/metodo-pagination?page=${page}&sort=${sortField}&order=${sortOrder}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al obtener los métodos de pago");
  }
  const data = await response.json();
  return data;
};

const MetodosPagoPage = () => {
  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("nombre");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const loadMetodosPago = async () => {
      try {
        const data = await fetchMetodosPago(currentPage, sortField, sortOrder);
        setMetodosPago(data.data);
        setTotalPages(data.last_page);
      } catch (err) {
        setError("Error al cargar los métodos de pago.");
      } finally {
        setLoading(false);
      }
    };

    loadMetodosPago();
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
          <h1 className="text-2xl font-bold">
            Administración de Métodos de Pago
          </h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">
            Lista de Métodos de Pago
          </h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 border-b cursor-pointer"
                    onClick={() => handleSort("nombre")}
                  >
                    Nombre{" "}
                    {sortField === "nombre" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-2 border-b">Descripción</th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {metodosPago.length > 0 ? (
                  metodosPago.map((metodo) => (
                    <tr key={metodo.id} className="text-center">
                      <td className="px-4 py-2 border-b">
                        {metodo.nombre_metodo}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {metodo.descripcion}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          onClick={() =>
                            Swal.fire({
                              title: "Detalles del Método de Pago",
                              text: `Nombre: ${metodo.nombre_metodo}\nDescripción: ${metodo.descripcion}`,
                              icon: "info",
                            })
                          }
                          variant={"primary"}
                          type={"submit"}
                          label={"Ver Detalles"}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center px-4 py-2 border-b">
                      No hay métodos de pago disponibles.
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

export default MetodosPagoPage;
