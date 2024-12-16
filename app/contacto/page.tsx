"use client";
import { useState } from "react";
import Header from "@/components/ui/landing/header";
import Footer from "@/components/ui/landing/footer";
import Button from "@/components/shared/Button/Button";
import { FaPhoneAlt, FaMapMarkedAlt, FaEnvelope } from "react-icons/fa";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías implementar la lógica para enviar el formulario
    alert("Mensaje enviado!");
  };

  return (
    <div>
      <Header />
      <section className="p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Contáctanos</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Mensaje</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
              required 
            />
          </div>
          <Button variant="primary" label="Enviar Mensaje" type="submit" />
        </form>
      </section>

      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-10 mb-6">
            <div>
              <FaPhoneAlt className="text-3xl text-blue-400 mb-2" />
              <p className="text-lg font-semibold">Teléfono</p>
              <p>+1 (800) 123-4567</p>
            </div>
            <div>
              <FaMapMarkedAlt className="text-3xl text-blue-400 mb-2" />
              <p className="text-lg font-semibold">Dirección</p>
              <p>123 Calle Principal, Ciudad, País</p>
            </div>
            <div>
              <FaEnvelope className="text-3xl text-blue-400 mb-2" />
              <p className="text-lg font-semibold">Correo Electrónico</p>
              <p>contacto@inventorypro.com</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
