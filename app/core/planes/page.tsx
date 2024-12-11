"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import PlanModal from "@/components/ui/modals/PlanModal"; // Importa el modal para los planes
import { usePlanModal } from "@/hooks/modals/usePlanModal"; // Importa el hook para manejar el modal de los planes
import { IPlan } from "@/interfaces/IPlan"; // Importa la interfaz de plan

// Datos de ejemplo de planes
const planes: IPlan[] = [
  { id: "1", nombre: "Plan Básico", descripcion: "Acceso limitado a funciones básicas.", precio: "10.00", estado: "Activo", ciclos_de_facturacion: "Mensual", soporta_cantidades: "No" },
  { id: "2", nombre: "Plan Premium", descripcion: "Acceso completo a todas las funciones.", precio: "30.00", estado: "Activo", ciclos_de_facturacion: "Anual", soporta_cantidades: "Sí" },
  { id: "3", nombre: "Plan Empresarial", descripcion: "Soluciones avanzadas para empresas.", precio: "50.00", estado: "Inactivo", ciclos_de_facturacion: "Anual", soporta_cantidades: "Sí" },
];

const PlanesPage = () => {
  const planModal = usePlanModal();
  const [planesData, setPlanesData] = useState<IPlan[]>(planes);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;
  const [showCreateLabelForm, setShowCreateLabelForm] = useState<boolean>(false);

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(planesData.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [planesData]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return planesData.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar plan
  const handleDeletePlan = (id: string | number) => {
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
          setPlanesData(planesData.filter(plan => plan.id !== id));
          Swal.fire("Eliminado", "Plan eliminado correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar el plan", "error");
        }
      }
    });
  };

  // Añadir nuevo plan
  const handleAddNewPlan = () => {
    setShowCreateLabelForm(true);
    planModal.onOpen(); // Abre el modal al añadir nuevo plan
  };

  // Editar plan
  const handleEditPlan = (plan: IPlan) => {
    planModal.onOpen(plan); // Abre el modal con los datos del plan a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Planes</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nuevo Plan"
            type="button"
            variant="primary"
            onClick={handleAddNewPlan} // Llamar a la función para abrir el modal
          />
        </div>
        
        <PlanModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Planes</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && planesData.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={6} // Número de columnas ajustado a los campos del plan
                rowsPerPage={rowsPerPage}
                onEdit={handleEditPlan} // Función para editar
                onDelete={handleDeletePlan} // Función para eliminar
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
            !loading && <p className="text-gray-500">No hay planes para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PlanesPage;
