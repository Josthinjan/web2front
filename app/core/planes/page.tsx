"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import Table from "@/components/shared/Table/Table";

// Datos de ejemplo
const samplePlans = [
  {
    "id": "1",
    "nombre": "Plan Básico",
    "descripcion": "Acceso limitado a funciones básicas.",
    "precio": "10.00",
    "estado": "Activo",
    "ciclos_de_facturacion": "Mensual",
    "soporta_cantidades": "No",
  },
  {
    "id": "2",
    "nombre": "Plan Estándar",
    "descripcion": "Acceso a funciones intermedias, ideal para pequeñas empresas.",
    "precio": "25.00",
    "estado": "Activo",
    "ciclos_de_facturacion": "Anual",
    "soporta_cantidades": "Sí",
  },
  {
    "id": "3",
    "nombre": "Plan Premium",
    "descripcion": "Acceso completo a todas las funciones avanzadas.",
    "precio": "50.00",
    "estado": "Inactivo",
    "ciclos_de_facturacion": "Mensual",
    "soporta_cantidades": "Sí",
  },
  {
    "id": "4",
    "nombre": "Plan Corporativo",
    "descripcion": "Solución personalizada para grandes empresas.",
    "precio": "200.00",
    "estado": "Activo",
    "ciclos_de_facturacion": "Anual",
    "soporta_cantidades": "Sí",
  },
  {
    "id": "5",
    "nombre": "Plan Lite",
    "descripcion": "Versión reducida con funciones esenciales.",
    "precio": "5.00",
    "estado": "Activo",
    "ciclos_de_facturacion": "Mensual",
    "soporta_cantidades": "No",
  }
];

// Función para enviar los datos del nuevo plan al backend
const submitPlanData = async (planData: any) => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/planes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(planData),
  });
  if (!response.ok) {
    throw new Error('Error al enviar los datos del plan');
  }
  return response.json();
};

const PlansPage = () => {
  const [plans, setPlans] = useState<any[]>(samplePlans); // Usar los datos de ejemplo
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(5);

  // Función para obtener los datos paginados
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return plans.slice(startIndex, endIndex);
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(plans.length / rowsPerPage);

  // Manejo de edición de plan
  const handleEditPlan = (id: string) => {
    console.log("Editar plan con ID:", id);
    // Aquí puedes implementar la lógica de edición.
  };

  // Manejo de eliminación de plan
  const handleDeletePlan = (id: string) => {
    console.log("Eliminar plan con ID:", id);
    // Aquí puedes implementar la lógica de eliminación.
  };

  // Manejo de añadir nuevo plan
  const handleAddNewPlan = async () => {
    const newPlan = {
      nombre: "Nuevo Plan",
      descripcion: "Descripción del nuevo plan.",
      precio: "30.00",
      estado: "Activo",
      ciclos_de_facturacion: "Mensual",
      soporta_cantidades: "Sí",
    };

    try {
      setLoading(true);
      const addedPlan = await submitPlanData(newPlan);
      setPlans([...plans, addedPlan]);
      Swal.fire("Éxito", "Nuevo plan agregado exitosamente", "success");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al agregar el plan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Planes</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Plan"
            type="button"
            variant="primary"
            onClick={handleAddNewPlan}
            disabled={loading} // Deshabilitado mientras se carga
          />
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Planes Disponibles</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <Table
              data={getPaginatedData()} // Pasar los datos paginados
              columns={7} // Número de columnas
              rowsPerPage={rowsPerPage} // Número de filas por página
              onEdit={handleEditPlan} // Función para editar
              onDelete={handleDeletePlan} // Función para eliminar
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

export default PlansPage;
