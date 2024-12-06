import { create } from "zustand";


type ChatBotModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useChatBotModal = create<ChatBotModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));