"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaMoneyCheckAlt, FaPaypal, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';
import { config } from "@/config/config";
import Footer from '@/components/landing/footer';
import Header from "@/components/landing/header";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        cedula: '',
        correo_electronico: '',
        password: '',
        repeatPassword: '',
        rol: 'owner',
        id_plan: '',
        metodo_pago: '1'
    });

    const [planes, setPlanes] = useState<{ id: string; name: string }[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/planes`);
                if (!response.ok) {
                    throw new Error('Error al obtener los planes');
                }
                const data = await response.json();
                console.log('Planes:', data); // Agregado para depuración

                if (data && data.length > 0) {
                    setPlanes(data);

                    // Establece el primer plan como valor por defecto si hay planes disponibles
                    setFormData((prevState) => ({
                        ...prevState,
                        id_plan: ''
                    }));
                } else {
                    // Si no hay planes disponibles, puedes manejarlo aquí
                    setFormData((prevState) => ({
                        ...prevState,
                        id_plan: '' // O algún valor predeterminado
                    }));
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        console.log('Handle Change:', e.target.name, e.target.value); // Agregado para depuración
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        Swal.showLoading();
        console.log('Form Data:', formData); // Agregado para depuración

        // Validar que se haya seleccionado un plan
        if (!formData.id_plan || formData.id_plan === 'default') {
            await Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona un plan.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                if (result.redirect_url) {
                    // Abre la URL en una nueva pestaña y guarda la referencia
                    const newWindow = window.open(result.redirect_url, '_blank');

                    // Escucha el mensaje de la ventana emergente
                    const handleMessage = (event: MessageEvent) => {
                        if (event.data === 'payment_success') {
                            // Cierra la ventana emergente
                            if (newWindow && !newWindow.closed) {
                                newWindow.close();
                            }

                            // Mostrar mensaje de éxito
                            Swal.fire({
                                title: 'Éxito',
                                text: 'Suscripción activada correctamente.',
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            });

                            // Remover el listener para evitar fugas de memoria
                            window.removeEventListener('message', handleMessage);
                        }
                    };

                    window.addEventListener('message', handleMessage);

                    // Opcional: Limpiar el listener cuando se cierra la ventana
                    if (newWindow) {
                        newWindow.addEventListener('unload', () => {
                            window.removeEventListener('message', handleMessage);
                        });
                    }
                } else {
                    await Swal.fire({
                        title: 'Éxito',
                        text: result.message,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });
                }
            } else {
                await Swal.fire({
                    title: 'Error',
                    text: result.message || 'No se pudo completar el registro. Por favor, intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            }
        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: 'No se pudo completar el registro. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };



    return (
        <div className="contenedor-register">
            <Header />
            <div className="register-container">
                <h2>Suscripción</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <div className="input-group">
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Nombre"
                            />
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Apellido"
                            />
                        </div>
                        <input
                            type="email"
                            id="correo_electronico"
                            name="correo_electronico"
                            value={formData.correo_electronico}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Correo Electrónico"
                        />
                        <div className="input-group">
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Teléfono"
                            />
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Cédula"
                            />
                        </div>
                        <div className="input-group">
                            <div className="password-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Contraseña"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>

                                <input
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    value={formData.repeatPassword}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Repetir Contraseña"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                >
                                    {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="input-group">
                            <select
                                id="id_plan"
                                name="id_plan"
                                value={formData.id_plan}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="" selected disabled>Selecciona un plan</option>

                                {planes.map(plan => (
                                    <option key={plan.id} value={plan.id_plan}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="metodo_pago">Método de Pago:</label>
                            <div className="payment-methods">
                                <label>
                                    <input
                                        type="radio"
                                        name="metodo_pago"
                                        value="1"
                                        checked={formData.metodo_pago === '1'}
                                        onChange={handleChange}
                                    />
                                    Transferencia Bancaria <FaMoneyCheckAlt className="icon" />
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="metodo_pago"
                                        value="2"
                                        checked={formData.metodo_pago === '2'}
                                        onChange={handleChange}
                                    />
                                    PayPal <FaPaypal className="icon" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">Registrar</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;