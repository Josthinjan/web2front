"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useUserModal } from "@/hooks/modals/useUserModal";
import { IUser } from "@/interfaces/IUser";
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";
import { useFetch } from "@/hooks/useFetch";
import Swal from "sweetalert2";

// Definir las propiedades que recibe UserModal
interface UserModalProps {
  setShouldRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserModal: React.FC<UserModalProps> = ({ setShouldRefetch }) => {
  const userModal = useUserModal();
  const [formData, setFormData] = useState<IUser>({
    id_usuario: 0,
    nombre: "",
    apellido: "",
    cedula: "",
    correo_electronico: "",
    telefono: "",
    created_at: "",
    updated_at: "",
    rol_id: "", // Asegúrate de tener un valor para el rol
    isActive: true, // Aseguramos que esté presente en el estado
    password: "", // Se agregó el campo de contraseña
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-cargar los datos si estamos editando un usuario
  useEffect(() => {
    if (userModal.userToEdit) {
      setFormData({
        id_usuario: userModal.userToEdit.id_usuario,
        nombre: userModal.userToEdit.nombre,
        apellido: userModal.userToEdit.apellido,
        cedula: userModal.userToEdit.cedula,
        correo_electronico: userModal.userToEdit.correo_electronico,
        telefono: userModal.userToEdit.telefono,
        created_at: userModal.userToEdit.created_at,
        updated_at: userModal.userToEdit.updated_at,
        rol_id: userModal.userToEdit.rol_id,
        isActive: userModal.userToEdit.isActive,
        password: "", // Dejamos la contraseña vacía para editarla manualmente si es necesario
      });
    } else {
      // Resetear formData al abrir para crear un nuevo usuario
      setFormData({
        id_usuario: 0,
        nombre: "",
        apellido: "",
        cedula: "",
        correo_electronico: "",
        telefono: "",
        created_at: "",
        updated_at: "",
        rol_id: "", // Asignar rol vacío por defecto
        isActive: true,
        password: "", // Aseguramos que password esté vacío por defecto
      });
    }
  }, [userModal.userToEdit]); // Este useEffect se ejecuta cada vez que se actualiza userModal.userToEdit

  const { data, error, loading, refetch } = useFetch<IUser>({
    url: "/register/employee",  // Cambiar la URL a la ruta correcta
    method: "POST",
    body: JSON.stringify(formData),
    skipToken: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar que todos los campos estén completos
    if (!formData.nombre || !formData.apellido || !formData.cedula || !formData.correo_electronico || !formData.telefono || !formData.rol_id || !formData.password) {
      Swal.fire("Error", "Por favor, completa todos los campos correctamente.", "error");
      return;
    }

    // Evitar que se envíe el formulario si ya está en proceso de envío
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await refetch();

      // Si hay un error, muestra el mensaje de error
      if (error) {
        Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
        return;
      }

      // Si los datos se procesan correctamente
      if (data) {
        Swal.fire("Éxito", userModal.userToEdit ? "Usuario actualizado correctamente" : "Usuario creado correctamente", "success");

        // Indicamos que es necesario hacer un refetch
        setShouldRefetch(true);

        // Cerramos el modal después de la operación
        userModal.onClose();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ocurrió un error");
      Swal.fire("Error", "Ocurrió un problema al procesar la solicitud.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const userModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Nombre"
        name="nombre"
        idInput="nombre"
        value={formData.nombre}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Apellido"
        name="apellido"
        idInput="apellido"
        value={formData.apellido}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Cédula"
        name="cedula"
        idInput="cedula"
        value={formData.cedula}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Correo Electrónico"
        name="correo_electronico"
        idInput="correo_electronico"
        value={formData.correo_electronico}
        onChange={handleChange}
        type="email"
      />
      <FormInput
        label="Teléfono"
        name="telefono"
        idInput="telefono"
        value={formData.telefono}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Rol"
        name="rol_id"
        idInput="rol_id"
        value={formData.rol_id}
        onChange={handleChange}
        type="text" // Deberías usar un select o algún componente adecuado para elegir el rol
      />
      <FormInput
        label="Contraseña"
        name="password"
        idInput="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
      />
      <div style={{ marginTop: "10px" }}> {/* Ajusta este margen según sea necesario */}
        <Button
          type="submit"
          variant="primary"
          label={userModal.userToEdit ? "Actualizar Usuario" : "Crear Usuario"}
          isDisabled={isSubmitting} // Deshabilitar el botón mientras se está enviando la solicitud
        />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={userModal.isOpen}
      onClose={userModal.onClose}
      title={userModal.userToEdit ? "Editar Usuario" : "Crear Usuario"}
      body={userModalBody}
    />
  );
};

export default UserModal;
