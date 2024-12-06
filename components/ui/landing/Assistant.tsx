"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { config } from "@/config/config"; // Asegúrate de que config tenga tu API_BASE_URL
import { FiMessageCircle, FiX } from "react-icons/fi"; // Importa iconos necesarios

const Assistant: React.FC = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ question?: string; response?: string }[]>([]);
    const [frequentQuestions] = useState([
        "¿Cómo te llamas?",
        "¿Qué puedes hacer?",
        "¿Cuál es tu precio?",
    ]);
    const [inputValue, setInputValue] = useState("");

    const toggleChat = () => setChatOpen(!chatOpen);

    const sendQuestion = async (question: string) => {
        setMessages((prev) => [...prev, { question }]);

        try {
            const response = await fetch(`${config.API_BASE_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });
            const data = await response.json();
            setMessages((prev) => [...prev, { response: data.response }]);
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener una respuesta del servidor.", "error");
        }
    };

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendQuestion(inputValue);
            setInputValue("");
        }
    };

    return (
        <>
            {/* Botón de asistente virtual */}
            <div className="assistant-container">
                <div className="assistant-button" onClick={toggleChat}>
                    {chatOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
                </div>

                {/* Hover text al pasar sobre el icono */}
                {!chatOpen && (
                    <div className="hover-text">
                        <p>Hola, soy Jhin tu asistente virtual. Da click aquí para empezar a hablar.</p>
                    </div>
                )}
            </div>

            {/* Chatbox */}
            {chatOpen && (
                <div className="chatbox">
                    <div className="chatbox-header">
                        <h4>Asistente Virtual</h4>
                        <button onClick={toggleChat}>X</button>
                    </div>
                    <div className="chatbox-body">
                        {messages.map((message, index) => (
                            <div key={index} className="message">
                                {message.question && <p className="user-message">Tú: {message.question}</p>}
                                {message.response && <p className="bot-message">Jhin: {message.response}</p>}
                            </div>
                        ))}
                        {/* Mostrar preguntas frecuentes si no hay mensajes de respuesta */}
                        {messages.length === 0 && (
                            <div className="frequent-questions">
                                <h5>Preguntas Frecuentes</h5>
                                <ul>
                                    {frequentQuestions.map((q, index) => (
                                        <li key={index} onClick={() => sendQuestion(q)}>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <form className="chatbox-footer" onSubmit={handleQuestionSubmit}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            )}

            <style jsx>{`
        .assistant-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        .assistant-button {
            width: 60px;
            height: 60px;
            background-color: #007bff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .assistant-button:hover {
            background-color: #0056b3;
            transform: scale(1.1);
        }

        .hover-text {
            position: absolute;
            bottom: 50px; /* Ajusta la posición sobre el botón del asistente */
            right: 47px;
            background-color: white;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 10px; /* Bordes más redondeados para parecerse a un globo */
            width: 250px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            color: #333;
            text-align: left;
    }

        .hover-text::before {
            content: "";
            position: absolute;
            bottom: -10px; /* Posición por debajo del recuadro */
            right: 20px; /* Ajusta la posición del triángulo según sea necesario */
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid white; /* El color debe coincidir con el fondo del globo */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra para el triángulo */
    }


        .chatbox {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .chatbox-header {
            background-color: #007bff;
            color: white;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
        }

        .chatbox-body {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
            font-size: 14px;
            color: #333;
        }

        .chatbox-footer {
            padding: 15px;
            border-top: 1px solid #ddd;
            display: flex;
            align-items: center;
        }

        .chatbox-footer input {
            flex: 1;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
            font-size: 14px;
            color: black;
        }

        .chatbox-footer button {
            margin-left: 10px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .chatbox-footer button:hover {
            background-color: #0056b3;
        }

        .message {
            margin-bottom: 10px;
            font-size: 14px;
        }

        .user-message {
            background-color: #e9f7fe;
            padding: 10px;
            border-radius: 5px;
            align-self: flex-end;
            max-width: 80%;
            word-wrap: break-word;
        }

        .bot-message {
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 5px;
            align-self: flex-start;
            max-width: 80%;
            word-wrap: break-word;
        }

        .frequent-questions ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .frequent-questions li {
            padding: 10px 0;
            cursor: pointer;
            color: #007bff;
            font-size: 14px;
            transition: color 0.3s ease;
        }

        .frequent-questions li:hover {
            text-decoration: underline;
            color: #0056b3;
        }
        `}</style>
        </>
    );
};

export default Assistant;
