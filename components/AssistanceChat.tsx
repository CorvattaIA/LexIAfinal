
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LAW_AREAS } from '../constants';
import { LawAreaId, ChatMessage } from '../types';
import { sendMessageToGemini, resetChatSession } from '../services/geminiService';
import Button from './ui/Button';
import Card from './ui/Card';

interface AssistanceChatProps {}

const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const ArrowPathIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);


const AssistanceChat: React.FC<AssistanceChatProps> = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<LawAreaId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const areaFromQuery = queryParams.get('area') as LawAreaId;
    if (areaFromQuery && Object.values(LawAreaId).includes(areaFromQuery)) {
        setSelectedAreaId(areaFromQuery);
    }
  }, [location.search]);


  useEffect(() => {
    if (selectedAreaId) {
      setMessages([]); 
      setError(null);
      resetChatSession(selectedAreaId, false);
      const areaName = LAW_AREAS.find(a => a.id === selectedAreaId)?.name || 'asuntos legales';
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Hola, soy tu asistente virtual para ${areaName}. ¿Cómo puedo ayudarte hoy con una consulta general? Para asesoría avanzada, considera nuestro servicio LexIA después del test diagnóstico.`,
        sender: 'ai',
        timestamp: new Date(),
        area: selectedAreaId,
      };
      setMessages([welcomeMessage]);
    } else {
        setMessages([]);
    }
  }, [selectedAreaId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !selectedAreaId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      area: selectedAreaId,
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponseText = await sendMessageToGemini(selectedAreaId, inputValue, messages);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        area: selectedAreaId,
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (e: any) {
      setError(e.message || "Error al obtener respuesta del asistente.");
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
        sender: 'ai',
        timestamp: new Date(),
        area: selectedAreaId,
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, selectedAreaId, messages]);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAreaId = e.target.value as LawAreaId;
    setSelectedAreaId(newAreaId);
    navigate(`/chat?area=${newAreaId}`, { replace: true }); 
  };

  const handleResetChat = () => {
    if(selectedAreaId){
        resetChatSession(selectedAreaId, false);
        const areaName = LAW_AREAS.find(a => a.id === selectedAreaId)?.name || 'asuntos legales';
        const welcomeMessage: ChatMessage = {
            id: Date.now().toString(),
            text: `Chat reiniciado para ${areaName}. ¿En qué puedo ayudarte?`,
            sender: 'ai',
            timestamp: new Date(),
            area: selectedAreaId,
          };
        setMessages([welcomeMessage]);
        setError(null);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto">
      <Card className="mb-6 flex-shrink-0 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <label htmlFor="lawAreaSelect" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/80 mb-1 font-title">
                    Área de asistencia (general):
                </label>
                <select
                    id="lawAreaSelect"
                    value={selectedAreaId || ''}
                    onChange={handleAreaChange}
                    className="bg-[var(--surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-on-dark-soft)] text-sm rounded-lg focus:ring-2 focus:ring-[var(--golden-accent)] focus:border-[var(--golden-accent)] block w-full p-2.5 shadow-sm placeholder-[var(--text-on-dark-soft)]/50"
                >
                    <option value="" disabled className="text-[var(--text-on-dark-soft)]/50">Selecciona un área...</option>
                    {LAW_AREAS.filter(area => area.isFullyImplemented).map(area => (
                    <option key={area.id} value={area.id} className="text-[var(--text-on-dark)] bg-[var(--deep-blue-dark)]">{area.name}</option>
                    ))}
                </select>
            </div>
            {selectedAreaId && (
                <Button onClick={handleResetChat} variant="outline" size="sm" leftIcon={<ArrowPathIcon className="w-4 h-4 text-[var(--golden-accent)]"/>}>
                    Reiniciar chat
                </Button>
            )}
        </div>
         <p className="text-xs text-[var(--text-on-dark-soft)]/60 mt-3 text-center sm:text-left">
            Este es un chat de asistencia general. Para una consulta avanzada y análisis detallado, completa nuestro <a href="#/assessment" className="text-[var(--golden-accent)] hover:underline">test diagnóstico gratuito</a> y accede a LexIA.
        </p>
      </Card>

      {!selectedAreaId && (
        <Card className="flex-grow flex items-center justify-center p-6">
          <p className="text-[var(--text-on-dark-soft)]/70 text-lg text-center">Por favor, selecciona un área de derecho para comenzar el chat de asistencia general.</p>
        </Card>
      )}

      {selectedAreaId && (
        <Card className="flex-grow flex flex-col overflow-hidden p-0">
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[var(--deep-blue-dark)] rounded-t-md custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md ${
                    msg.sender === 'user' 
                    ? 'bg-[var(--sky-blue-medium)] text-[var(--deep-blue-dark)] rounded-br-none' 
                    : 'bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)] rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-[var(--deep-blue-dark)]/70' : 'text-[var(--text-on-dark-soft)]/60'} text-right`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)] rounded-bl-none">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-[var(--golden-accent)]" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-[var(--text-on-dark-soft)]/80">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
            {error && <p className="text-red-400 text-sm px-2">{error}</p>}
          </div>
          <div className="p-4 border-t border-[var(--border-subtle)]/30 bg-[var(--surface-subtle)] rounded-b-md">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Escribe tu mensaje aquí..."
                className="flex-grow bg-[var(--deep-blue-dark)] border border-[var(--border-subtle)] text-[var(--text-on-dark)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--golden-accent)] outline-none shadow-sm placeholder-[var(--text-on-dark-soft)]/60"
                disabled={isLoading || !selectedAreaId}
              />
              <Button
                onClick={handleSendMessage}
                isLoading={isLoading}
                disabled={!inputValue.trim() || !selectedAreaId}
                variant="primary"
                className="p-3 aspect-square" 
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span className="sr-only">Enviar</span>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AssistanceChat;
