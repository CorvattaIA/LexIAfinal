
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LexiaIcon as DefaultLexiaIcon } from '../constants';
import { LawAreaId, ChatMessage, LexiaContext } from '../types';
import { sendLexiaMessage, resetChatSession } from '../services/geminiService';
import Button from './ui/Button';
import Card from './ui/Card';

// Helper Icons
const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const PaperClipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


interface LexiaChatProps {}

const LexiaChat: React.FC<LexiaChatProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lexiaContext } = (location.state as { lexiaContext?: LexiaContext }) || {};

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!lexiaContext || !lexiaContext.determinedArea) {
      navigate('/assessment');
      return;
    }
    resetChatSession(lexiaContext.determinedArea.id, true); 
    
    let welcomeText = `¡Hola ${lexiaContext.userName || 'Usuario'}! Bienvenido a LexIA, tu asesor legal inteligente.\n\nHe revisado la información de tu test gratuito y entiendo que tu consulta principal se relaciona con **${lexiaContext.determinedArea.name}**.`;
    if (lexiaContext.testAnswersSummary && lexiaContext.testAnswersSummary !== "No se proporcionaron detalles específicos en el test.") {
        welcomeText += `\n\nResumen de tu test: *"${lexiaContext.testAnswersSummary}"*\n\nPara ayudarte mejor, por favor cuéntame más sobre tu situación o hazme preguntas específicas. También puedes adjuntar una imagen de algún documento relevante (opcional).`;
    } else {
        welcomeText += `\n\nPara poder ofrecerte un diagnóstico detallado y opciones estratégicas, por favor, cuéntame más sobre tu situación específica. También puedes adjuntar una imagen de algún documento relevante si lo consideras útil.`;
    }
    welcomeText += "\n\nRecuerda, esta es una consulta avanzada con un costo de 45.000 COP (ya cubierto).";


    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      text: welcomeText,
      sender: 'ai',
      timestamp: new Date(),
      area: lexiaContext.determinedArea.id,
    };
    setMessages([welcomeMessage]);
  }, [lexiaContext, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { 
            setError("El archivo es muy grande. Máximo 5MB.");
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError("Por favor, selecciona un archivo de imagen (PNG, JPG, GIF, WEBP).");
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setSelectedFilePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = useCallback(async () => {
    if ((!inputValue.trim() && !selectedFile) || !lexiaContext) return;

    const userMessageText = inputValue.trim();
    let imagePayload: ChatMessage['image'] | undefined = undefined;
    let imageDataForApi: { mimeType: string; data: string; } | undefined = undefined;

    if (selectedFile && selectedFilePreview) {
        imagePayload = {
            name: selectedFile.name,
            type: selectedFile.type,
            dataUrl: selectedFilePreview 
        };
        imageDataForApi = {
            mimeType: selectedFile.type,
            data: selectedFilePreview.split(',')[1]
        };
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
      area: lexiaContext.determinedArea.id,
      image: imagePayload
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    removeSelectedFile(); 
    setIsLoading(true);
    setError(null);

    const currentChatHistory = [...messages, userMessage];
    
    try {
      const aiResponseText = await sendLexiaMessage(
        lexiaContext.determinedArea.id,
        userMessageText,
        currentChatHistory,
        lexiaContext.testAnswersSummary || "No se proporcionó resumen del test inicial.",
        imageDataForApi
      );
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        area: lexiaContext.determinedArea.id,
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (e: any) {
      setError(e.message || "Error al obtener respuesta de LexIA.");
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, ha ocurrido un error al comunicarme con LexIA. Por favor, inténtalo de nuevo o contacta a soporte.",
        sender: 'ai',
        timestamp: new Date(),
        area: lexiaContext.determinedArea.id,
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, selectedFile, selectedFilePreview, lexiaContext, messages]);


  if (!lexiaContext) {
    return (
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto items-center justify-center">
        <p className="text-lg text-[var(--text-on-dark-soft)]">Cargando contexto de LexIA...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <Card className="mb-6 flex-shrink-0 p-4 border-b-2 border-[var(--golden-accent)]">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <DefaultLexiaIcon className="w-10 h-10 text-[var(--golden-accent)] mr-3"/>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-on-dark)] font-title">LexIA</h1>
                    <p className="text-sm text-[var(--golden-accent)]">Asesoría legal inteligente para {lexiaContext.determinedArea.name}</p>
                </div>
            </div>
            <Button 
              onClick={() => {
                resetChatSession(lexiaContext.determinedArea.id, true);
                navigate('/assessment');
              }}
              variant="outline" 
              size="sm"
              title="Finalizar sesión y volver al test"
            >
                Finalizar sesión
            </Button>
        </div>
      </Card>

      <Card className="flex-grow flex flex-col overflow-hidden p-0">
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[var(--deep-blue-dark)] rounded-t-md custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md md:max-w-lg lg:max-w-xl px-4 py-3 rounded-xl shadow-md ${
                  msg.sender === 'user' 
                  ? 'bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] rounded-br-none' 
                  : 'bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)] rounded-bl-none'
              }`}>
                {msg.image && (
                    <div className="mb-2 border border-[var(--border-subtle)]/50 rounded-md overflow-hidden">
                        <img src={msg.image.dataUrl} alt={msg.image.name} className="max-w-xs max-h-64 object-contain"/>
                    </div>
                )}
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
                  <span className="text-sm text-[var(--text-on-dark-soft)]/80">LexIA está analizando...</span>
                </div>
              </div>
            </div>
          )}
          {error && <p className="text-red-400 text-sm px-2">{error}</p>}
        </div>

        {selectedFilePreview && (
            <div className="p-2 border-t border-[var(--border-subtle)]/30 bg-[var(--surface-subtle)]">
                <div className="flex items-center justify-between bg-[var(--deep-blue-dark)] p-2 rounded-md">
                    <div className="flex items-center overflow-hidden">
                        <img src={selectedFilePreview} alt="Vista previa" className="w-10 h-10 object-cover rounded-sm mr-2 flex-shrink-0"/>
                        <span className="text-xs text-[var(--text-on-dark-soft)]/80 truncate">{selectedFile?.name}</span>
                    </div>
                    <Button onClick={removeSelectedFile} variant="ghost" size="sm" className="p-1 aspect-square text-red-400 hover:text-red-300 flex-shrink-0">
                        <XCircleIcon className="w-5 h-5"/>
                    </Button>
                </div>
            </div>
        )}

        <div className="p-4 border-t border-[var(--border-subtle)]/30 bg-[var(--surface-subtle)] rounded-b-md">
          <div className="flex items-center space-x-2">
            <Button 
                variant="ghost" 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 aspect-square"
                title="Adjuntar imagen (PNG, JPG, max 5MB)"
                disabled={isLoading}
            >
                <PaperClipIcon className="w-5 h-5 text-[var(--text-on-dark-soft)]/80 hover:text-[var(--golden-accent)]"/>
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/gif, image/webp" 
                className="hidden" 
                disabled={isLoading}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Escribe tu mensaje a LexIA..."
              className="flex-grow bg-[var(--deep-blue-dark)] border border-[var(--border-subtle)] text-[var(--text-on-dark)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--golden-accent)] outline-none shadow-sm placeholder-[var(--text-on-dark-soft)]/60"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              isLoading={isLoading}
              disabled={(!inputValue.trim() && !selectedFile) || isLoading}
              variant="primary"
              className="p-3 aspect-square" 
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LexiaChat;
