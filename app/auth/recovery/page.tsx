"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BsBadgeAdFill } from "react-icons/bs";
import Button from "@/components/shared/Button/Button";
import FormInput from "@/components/shared/Form/FormInput";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("correo_electronico");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token, // Capturado de la URL
          correo_electronico: email, // Capturado de la URL
          password: formData.password,
          password_confirmation: formData.confirmPassword, // Agregamos la confirmación de contraseña
        }),
      });

      if (!response.ok) {
        throw new Error("Error al restablecer la contraseña");
      }

      toast.success("Contraseña restablecida con éxito");
      router.push("/login");
    } catch (error) {
      toast.error("Hubo un error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-[100%] min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <div className="border border-gray-500 rounded p-5 max-w-[500px]">
        {/* Mismo encabezado que en el login */}
        <div className="flex justify-center items-center gap-1 py-6">
          <BsBadgeAdFill size={50} />
          <h1>Restablecer Contraseña</h1>
        </div>
        <p className="font-light text-sm py-2">
          Ingresa tu nueva contraseña para restablecer tu acceso
        </p>
        <form onSubmit={handleSubmit}>
          {/* Reutilización del componente FormInput */}
          <FormInput
            idInput="password"
            label="Nueva Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormInput
            idInput="confirmPassword"
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className="flex flex-col w-full p-5 justify-center items-center gap-2">
            {/* Reutilización del componente Button */}
            <Button
              type="submit"
              label="Restablecer Contraseña"
              variant="primary"
              isLoading={loading}
              isDisabled={loading}
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
