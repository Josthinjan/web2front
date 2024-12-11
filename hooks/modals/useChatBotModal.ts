import { create } from "zustand";
import { IChatbot } from "@/interfaces/IChatbot"; // Asegúrate de importar correctamente IChatbot

interface ChatbotModalState {
  isOpen: boolean;
  chatbotToEdit: IChatbot | null; // Pregunta y respuesta del chatbot que se está editando
  onOpen: (chatbot?: IChatbot) => void; // Puede recibir un chatbot a editar
  onClose: () => void;
}

export const useChatbotModal = create<ChatbotModalState>((set) => ({
  isOpen: false,
  chatbotToEdit: null, // Inicialmente no hay ningún chatbot para editar
  onOpen: (chatbot?: IChatbot) => set({
    isOpen: true,
    chatbotToEdit: chatbot || null, // Si no se pasa un chatbot, limpia el chatbotToEdit
  }),
  onClose: () => set({ isOpen: false, chatbotToEdit: null }), // Cerrar y resetear el chatbot en edición
}));
