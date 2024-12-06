import React, { useState } from "react";
import Button from "@/components/shared/Button/Button";
import Swal from "sweetalert2";

interface CreateProviderFormProps {
    onSubmit: (providerData: any) => void;
}

const CreateProviderForm: React.FC<CreateProviderFormProps> = ({ onSubmit }) => {
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre || !direccion || !email || !telefono || !ciudad) {
            Swal.fire("Error", "Todos los campos son obligatorios.", "error");
            return;
        }

        const providerData = {
            nombre: nombre,
            direccion: direccion,
            email: email,
            telefono: telefono,
            Cuidad: ciudad,  // Asegúrate de usar "Cuidad" con C mayúscula
            Activo: true,    // Usa "Activo" en lugar de "isActive"
            isActive: true   // Incluye también "isActive" si es necesario
        };

        onSubmit(providerData);

        // Limpiar el formulario después de enviar
        setNombre("");
        setDireccion("");
        setEmail("");
        setTelefono("");
        setCiudad("");
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Proveedor</h2>

            <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-bold mb-2">
                    Nombre del Proveedor
                </label>
                <input
                    id="nombre"
                    type="text"
                    className="w-full p-2 border text-gray-700 rounded"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="direccion" className="block text-sm font-bold mb-2">
                    Dirección
                </label>
                <input
                    id="direccion"
                    type="text"
                    className="w-full p-2 border text-gray-700 rounded"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full p-2 border text-gray-700 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="telefono" className="block text-sm font-bold mb-2">
                    Teléfono
                </label>
                <input
                    id="telefono"
                    type="tel"
                    className="w-full p-2 border text-gray-700 rounded"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="ciudad" className="block text-sm font-bold mb-2">
                    Ciudad
                </label>
                <input
                    id="ciudad"
                    type="text"
                    className="w-full p-2 border text-gray-700 rounded"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                />
            </div>

            <div className="flex justify-end">
                <Button label="Crear Proveedor" type="submit" variant="primary" />
            </div>
        </form>
    );
};

export default CreateProviderForm;
