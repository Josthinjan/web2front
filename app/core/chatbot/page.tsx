"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Table from "@/components/shared/Table/Table"; // Importa el componente Table
import ChatbotModal from "@/components/ui/modals/ChatbotModal"; // Importa el modal de chatbot
import { useChatbotModal } from "@/hooks/modals/useChatbotModal"; // Importa el hook para manejar el modal
import { IChatbot } from "@/interfaces/IChatbot"; // Importa la interfaz de chatbot

// Datos de ejemplo de preguntas y respuestas
const chatbotData: IChatbot[] = [
  { id: 1, question: "Hola", answer: "Hola, ¿cómo puedo ayudarte?" },
  { id: 2, question: "¿Cuál es tu nombre?", answer: "Soy un chatbot" },
  { id: 3, question: "¿Qué puedes hacer?", answer: "Puedo responder preguntas." },
];

const ChatbotPage = () => {
  const chatbotModal = useChatbotModal();
  const [chatbotDataState, setChatbotDataState] = useState<IChatbot[]>(chatbotData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 5;

  // Calcular el número total de páginas
  useEffect(() => {
    const totalPagesCalculated = Math.ceil(chatbotDataState.length / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [chatbotDataState]);

  // Obtener datos de la página actual para la paginación
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return chatbotDataState.slice(startIndex, endIndex);
  };

  // Cambiar de página en la paginación
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Eliminar pregunta y respuesta
  const handleDeleteChatbotData = (id: number | string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setChatbotDataState(chatbotDataState.filter(data => data.id !== id));
          Swal.fire("Eliminado", "Pregunta y respuesta eliminada correctamente", "success");
        } catch (error) {
          Swal.fire("Error", "Ocurrió un problema al eliminar la pregunta y respuesta", "error");
        }
      }
    });
  };

  // Agregar nueva pregunta y respuesta
  const handleAddNewChatbotData = () => {
    chatbotModal.onOpen(); // Abre el modal al añadir nueva pregunta y respuesta
  };

  // Editar pregunta y respuesta
  const handleEditChatbotData = (data: IChatbot) => {
    chatbotModal.onOpen(data); // Abre el modal con los datos a editar
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold">Administración de Chatbot</h1>
        </div>
        <div className="flex gap-3 justify-start items-center mb-6">
          <Button
            label="Añadir Nueva Pregunta"
            type="button"
            variant="primary"
            onClick={handleAddNewChatbotData} // Llamar a la función para abrir el modal
          />
        </div>
        
        <ChatbotModal />
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">Lista de Preguntas y Respuestas</h2>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && chatbotDataState.length > 0 ? (
            <>
              <Table
                data={getPaginatedData()}
                columns={2} // Número de columnas (Pregunta, Respuesta)
                rowsPerPage={rowsPerPage}
                onEdit={handleEditChatbotData} // Función para editar
                onDelete={handleDeleteChatbotData} // Función para eliminar
              />
              <div className="flex justify-between mt-4 w-full">
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          ) : (
            !loading && <p className="text-gray-500">No hay preguntas y respuestas para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatbotPage;
