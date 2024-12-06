"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import CreatePlanForm from "@/components/ui/createPlanForm/CreatePlanForm";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from '@/config/config';

// Función para obtener los datos de planes del backend
const fetchPlans = async () => {
  const token = getTokenFromCookie();
  const response = await fetch(`${config.API_BASE_URL}/planes`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Error al obtener los planes');
  }
  const data = await response.json();
  return data;
};

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


// Función para procesar el campo billing_cycles y extraer el precio con el símbolo del dólar
const parseBillingCycles = (cycles: string) => {
  try {
    const parsedCycles = JSON.parse(cycles);
    if (Array.isArray(parsedCycles) && parsedCycles.length > 0) {
      const cycle = parsedCycles[0];
      const amount = cycle?.pricing_scheme?.fixed_price?.value || "N/A";
      return `$${amount}`; // Mostrar solo el precio con el símbolo del dólar
    }
  } catch (e) {
    console.error("Error al procesar billing_cycles", e);
  }
  return "N/A";
};

// Función para procesar el campo payment_preferences y extraer información relevante
const parsePaymentPreferences = (preferences: string) => {
  try {
    const parsedPreferences = JSON.parse(preferences);
    const autoBill = parsedPreferences.auto_bill_outstanding ? "Sí" : "No";
    const setupFee = parsedPreferences.setup_fee?.value || "N/A";
    return `Auto-billing: ${autoBill}, Setup Fee: $${setupFee}`; // Mostrar tarifa de configuración con el símbolo del dólar
  } catch (e) {
    console.error("Error al procesar payment_preferences", e);
  }
  return "N/A";
};

// Función para procesar el campo taxes y extraer información relevante
const parseTaxes = (taxes: string | null) => {
  if (taxes) {
    try {
      const parsedTaxes = JSON.parse(taxes);
      // Mostrar detalles básicos de impuestos si están disponibles
      return `Detalles: ${JSON.stringify(parsedTaxes)}`;
    } catch (e) {
      console.error("Error al procesar taxes", e);
    }
  }
  return "N/A";
};

const PlansPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePlanForm, setShowCreatePlanForm] = useState<boolean>(false);


  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (err) {
        setError("Error al cargar los planes.");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);
  const handleAddNewPlan = () => {
    setShowCreatePlanForm(true);
  };

  const handleSubmitPlan = async (planData: any) => {
    try {
      const newPlan = await submitPlanData(planData);
      if (newPlan && newPlan.id_plan) {
        setPlans([...plans, newPlan]);
        setShowCreatePlanForm(false);
        Swal.fire("Éxito", "Plan creado exitosamente", "success");
      } else {
        Swal.fire("Error", "No se pudo crear el plan", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo crear el plan", "error");
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
          />
        </div>
        {showCreatePlanForm && (
          <CreatePlanForm onSubmit={handleSubmitPlan} />
        )}
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Planes Disponibles</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead className="">
                <tr>
                  <th className="px-4 py-2 border-b">Nombre</th>
                  <th className="px-4 py-2 border-b">Descripción</th>
                  <th className="px-4 py-2 border-b">Precio</th>
                  <th className="px-4 py-2 border-b">Estado</th>
                  <th className="px-4 py-2 border-b">Ciclos de Facturación</th>
                  <th className="px-4 py-2 border-b">Preferencias de Pago</th>
                  <th className="px-4 py-2 border-b">Impuestos</th>
                  <th className="px-4 py-2 border-b">Soporta Cantidades</th>
                  <th className="px-4 py-2 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id_plan} className="text-center">
                    <td className="px-4 py-2 border-b">{plan.name}</td>
                    <td className="px-4 py-2 border-b">{plan.description || "N/A"}</td>
                    <td className="px-4 py-2 border-b">{parseBillingCycles(plan.billing_cycles)}</td>
                    <td className="px-4 py-2 border-b">{plan.status}</td>
                    <td className="px-4 py-2 border-b">Mensual</td> {/* Cambiado a "Mensual" fijo */}
                    <td className="px-4 py-2 border-b">{parsePaymentPreferences(plan.payment_preferences)}</td>
                    <td className="px-4 py-2 border-b">{parseTaxes(plan.taxes)}</td>
                    <td className="px-4 py-2 border-b">{plan.quantity_supported ? "Sí" : "No"}</td>
                    <td className="px-4 py-2 border-b">
                      <Button label="Editar" type="button" variant="outline" onClick={() => { }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlansPage;
