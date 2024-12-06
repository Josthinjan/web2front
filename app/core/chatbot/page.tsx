"use client";
import Button from "@/components/shared/Button/Button";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config";
import { getTokenFromCookie } from "@/config/config";
import { useFetch } from "@/hooks/useFetch";
import Label from "@/components/ui/label/Label";
import { useChatBotModal } from "@/hooks/modals/useChatBotModal";
import ChatBotModal from "@/components/ui/modals/ChatBotModal";

const ChatBotPage = () => {
  const chatBotModal = useChatBotModal();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("question");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newResponse, setNewResponse] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);


  // Fetch questions
  const {
    data: questionsData,
    loading: questionsLoading,
    error: questionsError,
  } = useFetch({
    url: `${config.API_BASE_URL}`,
  });

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col p-4 shadow-md rounded-lg">
        <div className="text-start w-full mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Administración de Preguntas del ChatBot
          </h1>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-xl text-gray-700 mb-4">
            Lista de Preguntas
          </h2>
          {questionsLoading && <Label type="info" text="Cargando preguntas" />}
          {questionsError && (
            <Label type="error" text="Error al cargar preguntas" />
          )}
          <div className="overflow-x-auto">
            <Button 
              variant="primary" 
              onClick={chatBotModal.onOpen} 
              label="Crear pregunta" 
              type="button"
            />
            <ChatBotModal />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatBotPage;
