"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Usamos el router para la redirección
import Swal from "sweetalert2";
import { FaMoneyCheckAlt, FaPaypal } from 'react-icons/fa';
import { config } from "@/config/config";
import Header from "@/components/ui/landing/header"; // Asegúrate de tener este componente
import Footer from "@/components/ui/landing/footer"; // Asegúrate de tener este componente

const PlansPage: React.FC = () => {
    const [planes, setPlanes] = useState<any[]>([]);
    const router = useRouter(); // Usamos el router para la redirección

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/planes`);
                if (!response.ok) {
                    throw new Error('Error al obtener los planes');
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    setPlanes(data);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se encontraron planes disponibles.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los planes. Inténtalo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            }
        };

        fetchPlans();
    }, []);

    const handlePlanSelect = (plan: any) => {
        // Extraemos el precio del plan desde el billing_cycles (usamos JSON.parse porque es un string JSON)
        const planPrice = JSON.parse(plan.billing_cycles)[0].pricing_scheme.fixed_price.value;
        
        // Redirige a la página de pago, pasando la información del plan
        const queryParams = new URLSearchParams({
            planId: plan.id_plan.toString(),
            planName: plan.name,
            planPrice: planPrice.toString(),
        }).toString();

        // Aquí generamos la URL con los parámetros de consulta
        router.push(`/pago?${queryParams}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto py-8 px-4 flex-grow">
                <h2 className="text-3xl font-bold text-center mb-6">Planes de Suscripción</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {planes.map((plan) => (
                        <div
                            key={plan.id_plan}
                            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
                            <p className="text-gray-600 mb-4">
                                <strong>Descripción:</strong> {plan.description || "No disponible."}
                            </p>
                            <div className="mb-4">
                                <p className="text-gray-600">
                                    <strong>Precio: </strong> ${JSON.parse(plan.billing_cycles)[0].pricing_scheme.fixed_price.value} USD
                                </p>
                                <p className="text-gray-600">
                                    <strong>Duración: </strong> {JSON.parse(plan.billing_cycles)[0].frequency.interval_count} mes(es)
                                </p>
                                <p className="text-gray-600">
                                    <strong>Setup Fee: </strong> ${JSON.parse(plan.payment_preferences).setup_fee.value} USD
                                </p>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={() => handlePlanSelect(plan)}
                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Seleccionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PlansPage;
