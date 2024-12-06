"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import './Home.css';
import Footer from "@/components/ui/landing/footer";
import Header from "@/components/ui/landing/header";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import { FaCaretRight } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      <Header />
      <section className="p-4 flex bg-gray-50 justify-center items-center">
        <div className="flex justify-center items-center">
          <div className="contenido-hero">
            <h2>Optimiza la Gestión de tu Inventario</h2><br />
            <p>Eficiente. Preciso. Confiable.</p><br /><br />
            <Button variant="outline" label="Empezar" Icon={FaCaretRight} onClick={() => console.log("Hola")} type="button"/>
          </div>
          <div className="imagen-hero">
            <Image
              src="/fondo.jpg" 
              alt="Ilustración del Tablero"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center p-4">
        <h1 className='font-bold text-xl text-blue-400 my-6'>Caracteristias</h1>
        <div className="flex justify-center items-center gap-2">
          <div className="tarjeta-caracteristica">
            <Image
              src="/seguimiento.png" 
              alt="Icono Seguimiento" 
              width={100}
              height={100}
            />
            <h3>Seguimiento en Tiempo Real</h3>
            <p>Monitorea tu inventario en tiempo real con nuestro sistema avanzado.</p>
          </div>
          <div className="tarjeta-caracteristica">
            <Image
              src="/alerta.png" 
              alt="Icono Alertas"
              width={100}
              height={100}
            />
            <h3>Alertas Automáticas</h3>
            <p>Recibe notificaciones para niveles bajos de stock y otras actualizaciones importantes.</p>
          </div>
          <div className="tarjeta-caracteristica">
            <Image
              src="/reporte.png" 
              alt="Icono Reportes"
              width={100}
              height={100}
            />
            <h3>Reportes Detallados</h3>
            <p>Genera reportes detallados para analizar el rendimiento de tu inventario.</p>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section className="testimonios">
        <div className="contenedor">
          <div className='italic font-light text-gray-600 text-center flex flex-col'>
            InventoryPro ha transformado completamente la manera en que gestionamos nuestro stock. ¡Altamente recomendado!
            <span className='font-bold italic'>– Stefano, Gerente</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
