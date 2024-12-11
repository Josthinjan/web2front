"use client";
import React, { FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";
import { useChatbotModal } from "@/hooks/modals/useChatbotModal"; // Hook para manejar el estado del modal
import { IChatbot } from "@/interfaces/IChatbot"; // Interfaz del chatbot
import Form from "@/components/shared/Form/Form";
import FormInput from "@/components/shared/Form/FormInput";
import Button from "@/components/shared/Button/Button";

const ChatbotModal = () => {
  const chatbotModal = useChatbotModal(); // Usamos el hook para el estado del modal
  const [formData, setFormData] = useState<IChatbot>({
    question: "",
    answer: "",
  });

  // Si chatbotToEdit está presente, precargamos los valores del formulario
  useEffect(() => {
    if (chatbotModal.chatbotToEdit) {
      setFormData({
        question: chatbotModal.chatbotToEdit.question,
        answer: chatbotModal.chatbotToEdit.answer,
      });
    } else {
      // Limpiar los datos cuando no se está editando
      setFormData({
        question: "",
        answer: "",
      });
    }
  }, [chatbotModal.chatbotToEdit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.question && formData.answer) {
      // Lógica para guardar o actualizar la pregunta y respuesta del chatbot
      console.log("Pregunta/Respuesta creada/actualizada:", formData);

      // Si estamos editando, pasamos los datos al backend con un PUT, si no es un POST para crear
      if (chatbotModal.chatbotToEdit) {
        // Lógica para actualizar la pregunta y respuesta
        console.log("Editando pregunta/respuesta:", formData);
      } else {
        // Lógica para crear la pregunta y respuesta
        console.log("Creando nueva pregunta/respuesta:", formData);
      }

      chatbotModal.onClose(); // Cerrar el modal después de crear o actualizar la pregunta/respuesta
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const chatbotModalBody = (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Pregunta"
        name="question"
        idInput="question"
        value={formData.question}
        onChange={handleChange}
        type="text"
      />
      <FormInput
        label="Respuesta"
        name="answer"
        idInput="answer"
        value={formData.answer}
        onChange={handleChange}
        type="text"
      />
      <div className="mt-4">
        <Button type="submit" variant="primary" label={chatbotModal.chatbotToEdit ? "Actualizar Pregunta" : "Crear Pregunta"} />
      </div>
    </Form>
  );

  return (
    <Modal
      isOpen={chatbotModal.isOpen}
      onClose={chatbotModal.onClose}
      title={chatbotModal.chatbotToEdit ? "Editar Pregunta" : "Crear Pregunta"}
      body={chatbotModalBody}
    />
  );
};

export default ChatbotModal;
