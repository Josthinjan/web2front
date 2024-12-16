"use client";

import React from "react";
import Header from "@/components/ui/landing/header"; // Asegúrate de tener este componente
import Footer from "@/components/ui/landing/footer"; // Asegúrate de tener este componente

const PoliticasDePrivacidad: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto py-12 px-6 flex-grow bg-white shadow-lg rounded-lg my-8">
                <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
                    Políticas de Privacidad
                </h1>
                <div className="prose lg:prose-xl max-w-none">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Introducción</h2>
                    <p className="mb-6">
                        En <strong>InventoryPro</strong> nos comprometemos a proteger tu privacidad. Esta política explica cómo
                        recopilamos, usamos, compartimos y protegemos tu información personal cuando utilizas nuestros servicios.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Información que Recopilamos</h2>
                    <p className="mb-4">
                        Recopilamos dos tipos principales de información:
                    </p>
                    <ul className="list-disc pl-6 mb-6">
                        <li><strong>Información personal:</strong> Incluye datos como tu nombre, correo electrónico, número de teléfono y detalles de pago, los cuales nos proporcionas directamente al registrarte o interactuar con nosotros.</li>
                        <li><strong>Información automática:</strong> Recopilamos información sobre tu dispositivo y cómo interactúas con nuestro sitio web, como la dirección IP, tipo de dispositivo y ubicación.</li>
                    </ul>
                    <p className="mb-4">
                        También podemos obtener información de terceros, como plataformas de pago o redes sociales, si decides vincular tu cuenta.
                    </p>

                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Cómo Usamos tu Información</h2>
                    <p className="mb-4">
                        Utilizamos la información que recopilamos para varios fines, como:
                    </p>
                    <ul className="list-disc pl-6 mb-6">
                        <li><strong>Proveer nuestros servicios:</strong> Procesamos pagos y proporcionamos acceso a herramientas de gestión de inventario.</li>
                        <li><strong>Mejoras y personalización:</strong> Mejoramos nuestros servicios y personalizamos tu experiencia según tus preferencias.</li>
                        <li><strong>Comunicación:</strong> Enviamos actualizaciones, notificaciones sobre tu cuenta, y mensajes administrativos o promocionales.</li>
                        <li><strong>Seguridad:</strong> Aseguramos nuestros servicios contra fraudes y otros riesgos de seguridad.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Compartir tu Información</h2>
                    <p className="mb-4">
                        No vendemos ni alquilamos tu información personal. Sin embargo, podemos compartirla en las siguientes circunstancias:
                    </p>
                    <ul className="list-disc pl-6 mb-6">
                        <li><strong>Proveedores de servicios:</strong> Podemos compartir datos con proveedores que nos ayuden a operar nuestro sitio y procesar pagos.</li>
                        <li><strong>Requerimientos legales:</strong> Compartimos información si es necesario para cumplir con obligaciones legales.</li>
                        <li><strong>Transacciones comerciales:</strong> En caso de una fusión o venta, tu información podría ser transferida.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Tus Derechos y Opciones</h2>
                    <p className="mb-4">
                        Tienes los siguientes derechos respecto a tu información:
                    </p>
                    <ul className="list-disc pl-6 mb-6">
                        <li><strong>Acceso y corrección:</strong> Puedes acceder y corregir tu información personal.</li>
                        <li><strong>Eliminación:</strong> Puedes solicitar la eliminación de tus datos, sujeta a ciertas excepciones.</li>
                        <li><strong>Revocar tu consentimiento:</strong> Puedes revocar el consentimiento para recibir comunicaciones promocionales en cualquier momento.</li>
                        <li><strong>Oposición al procesamiento:</strong> Tienes derecho a oponerte al procesamiento de tus datos en ciertas circunstancias.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Seguridad de la Información</h2>
                    <p className="mb-4">
                        Utilizamos medidas razonables para proteger tu información personal. Sin embargo, ninguna medida de seguridad es completamente infalible, por lo que no podemos garantizar una seguridad absoluta.
                    </p>

                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Retención de Datos</h2>
                    <p className="mb-4">
                        Conservamos tu información solo el tiempo necesario para cumplir con los fines establecidos en esta política, o según lo exijan las leyes aplicables.
                    </p>

                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Cambios en la Política de Privacidad</h2>
                    <p className="mb-4">
                        Esta Política de Privacidad puede ser actualizada en el futuro. Te notificaremos sobre los cambios importantes a través de otros medios, y te recomendamos revisar esta página periódicamente para mantenerte informado.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PoliticasDePrivacidad;
