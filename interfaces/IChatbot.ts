export interface IChatbot {
    id?: number; // Un identificador opcional, si es necesario para cada pregunta/respuesta
    question: string; // La pregunta que el chatbot puede responder
    answer: string; // La respuesta que el chatbot dará a la pregunta
  }
  