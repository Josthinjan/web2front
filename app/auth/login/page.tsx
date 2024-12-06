"use client";
import FormInput from "@/components/shared/Form/FormInput";
import { ChangeEvent, FormEvent, useState } from "react";
import { ILoginForm } from "@/interfaces/IAuthForm";
import { BsBadgeAdFill } from "react-icons/bs";
import Button from "@/components/shared/Button/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaDropbox } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { useFetch } from "@/hooks/useFetch";
import useUserStore from "@/stores/useUserStore";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<ILoginForm>({
    email: "",
    password: "",
  });

  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
    if (!formData.email || !formData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

  try {
 const response = await fetch(`${config.API_BASE_URL}/login`, {
method: "POST",
 headers: {
 "Content-Type": "application/json",
    },
   body: JSON.stringify(formData),
  });
  
 if (response.ok) {
    const data = await response.json();
    console.log(data);
      const newData = {
       email: data.email,
      name: data.nombre,
       role: data.rol,
     }
     setUser(newData); // Set user data in the store, the data is email, name and role  
      router.push("/core/dashboard");
     }
  } catch (error) {
    toast.error("Error al iniciar sesion");
  }
    
    
    setLoading(true);
    setTimeout(() => {
      if (
        formData.password === "admin" &&
        formData.email === "admin@admin.com"
      ) {
        router.push("/core/dashboard");
        setUser({
          email: formData.email,
          name: "Admin",
          role: "admin",
        });
        setLoading(false);
        return;
      } else if (
        formData.password === "user" &&
        formData.email === "user@user.com"
      ) {
        router.push("/core/dashboard");
        setUser({
          email: formData.email,
          name: "User",
          role: "user",
        });
        setLoading(false);
        return;
      } else if (
        formData.password === "owner" &&
        formData.email === "owner@owner.com"
      ) {
        router.push("/core/dashboard");
        setUser({
          email: formData.email,
          name: "Owner",
          role: "owner",
        });
        setLoading(false);
        return;
      }
    }, 2000);
  };

  const handleForgotPassword = () => {
    toast.error("Funcionalidad no disponible");
  };
  /* 
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Recuperar Contraseña',
      input: 'email',
      inputLabel: 'Por favor ingresa tu correo electrónico',
      inputPlaceholder: 'correo@example.com',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El correo electrónico es obligatorio!';
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return 'Por favor ingresa un correo electrónico válido';
        }
        return null;
      }
    });

    if (email) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/forget`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo_electronico: email }),
        });

        if (response.ok) {
          Swal.fire('¡Correo enviado!', 'Te hemos enviado un correo para recuperar tu contraseña', 'success');
        } else {
          throw new Error('Error enviando el correo');
        }
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al enviar el correo, por favor intenta nuevamente.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };
 */
  return (
    <main className="w-[100%] min-h-[calc(100vh-80px)] flex flex-col justify-center items-center bg-gray-100">
      <div className="border border-gray-300 rounded p-5 max-w-[500px] bg-white">
        <div className="flex justify-center items-center gap-1 py-6">
          <span className="flex justify-center items-center gap-1 font-bold text-gray-600">
            <FaDropbox size={40} />
            <h1>
              Inventory<span className="font-bold text-blue-400">Pro</span>
            </h1>
          </span>
        </div>
        <p className="font-light text-sm py-2">
          Bienvenido de vuelta a nuestro sistema, ingresa tus credenciales para
          continuar
        </p>
        <form onSubmit={handleSubmit}>
          <FormInput
            idInput="email"
            label="Correo Electronico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@inventorypro.com"
          />
          <FormInput
            idInput="password"
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />
          <div className="flex flex-col w-full p-5 justify-center items-center gap-2">
            <Button
              type="submit"
              label="Iniciar Sesion"
              variant="primary"
              isLoading={loading}
              isDisabled={loading}
            />
          </div>
        </form>
        <Link
          href="#"
          onClick={handleForgotPassword}
          className="hover:underline text-sm font-light"
        >
          Olvidaste tu Contraseña?
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
