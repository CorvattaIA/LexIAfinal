import React, { useState, useEffect, useRef } from 'react';
import { LexiaContext, ChatMessage, LawAreaId } from '../types';
import { sendLexiaMessage, resetChatSession } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';

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

const MinimizeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const MaximizeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

const MinimizeWindowIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3.75 3.75M9 9l4.5 4.5M15 15l5.25 5.25M15 15l-4.5-4.5" />
  </svg>
);

interface LexiaChatFloatingProps {
  lexiaContext: LexiaContext;
  onClose: () => void;
}

type ChatWindowSize = 'normal' | 'expanded' | 'minimized';

const LexiaChatFloating: React.FC<LexiaChatFloatingProps> = ({ lexiaContext, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState<ChatWindowSize>('normal');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!lexiaContext || !lexiaContext.determinedArea) {
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
  }, [lexiaContext]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("El archivo es demasiado grande. Máximo 5MB permitido.");
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setSelectedFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedFile) || isLoading) return;
    
    // Crear el objeto de imagen si hay un archivo seleccionado
    const imageObject = selectedFilePreview ? {
      name: selectedFile?.name || 'imagen.jpg',
      type: selectedFile?.type || 'image/jpeg',
      dataUrl: selectedFilePreview
    } : undefined;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      area: lexiaContext.determinedArea.id as LawAreaId,
      image: imageObject
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    
    if (selectedFile) {
      removeSelectedFile();
    }
    
    try {
      // Preparar los parámetros para la llamada a sendLexiaMessage
      const areaId = lexiaContext.determinedArea.id as LawAreaId;
      const testContextSummary = lexiaContext.testAnswersSummary || '';
      const chatHistory: ChatMessage[] = messages;
      
      // Preparar la imagen si existe
      const imageData = imageObject ? {
        mimeType: imageObject.type,
        data: imageObject.dataUrl.split(',')[1] // Eliminar el prefijo 'data:image/jpeg;base64,' para obtener solo los datos
      } : undefined;
      
      // Llamar al servicio con los parámetros correctos
      const response = await sendLexiaMessage(
        areaId,
        inputValue,
        chatHistory,
        testContextSummary,
        imageData
      );
      
      if (typeof response === 'string') {
        // Si la respuesta es un string, es el texto de la IA
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
          area: lexiaContext.determinedArea.id as LawAreaId,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (response && typeof response === 'object') {
        // Si la respuesta es un objeto con error
        const errorResponse = response as { error?: unknown };
        if (errorResponse.error) {
          setError(`Error: ${String(errorResponse.error)}`);
        }
      }
    } catch (err) {
      setError("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWindowSize = () => {
    setWindowSize(prev => {
      if (prev === 'normal') return 'minimized';
      if (prev === 'minimized') return 'normal';
      return 'normal';
    });
  };
  
  const toggleExpand = () => {
    setWindowSize(prev => prev === 'expanded' ? 'normal' : 'expanded');
  };

  // Determinar las clases y estilos según el tamaño de la ventana
  const getWindowClasses = () => {
    switch (windowSize) {
      case 'minimized':
        return {
          container: 'fixed bottom-4 right-4 z-50 w-64 transition-all duration-300 ease-in-out',
          height: 'auto'
        };
      case 'expanded':
        return {
          container: 'fixed inset-8 z-50 transition-all duration-300 ease-in-out flex',
          height: 'calc(100% - 16px)'
        };
      default: // 'normal'
        return {
          container: 'fixed bottom-4 right-4 z-50 w-[450px] transition-all duration-300 ease-in-out',
          height: '600px'
        };
    }
  };

  const windowClasses = getWindowClasses();

  return (
    <div className={windowClasses.container}>
      <Card className={`overflow-hidden shadow-xl border border-[var(--border-subtle)]/50 bg-[var(--deep-blue)] flex flex-col w-full ${windowSize === 'expanded' ? 'rounded-lg' : ''}`} style={{ height: windowClasses.height }}>
        <div className="p-3 bg-[var(--deep-blue-dark)] border-b border-[var(--border-subtle)]/30 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[var(--golden-accent)]/20 flex items-center justify-center mr-2">
              <span className="text-[var(--golden-accent)] font-bold">L</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-on-dark)]">LexIA Chat</h3>
          </div>
          <div className="flex space-x-1">
            <Button 
              onClick={toggleWindowSize} 
              variant="ghost" 
              size="sm" 
              className="p-1 text-[var(--text-on-dark-soft)]/80 hover:text-[var(--text-on-dark)]"
              title={windowSize === 'minimized' ? 'Restaurar' : 'Minimizar'}
            >
              {windowSize === 'minimized' ? <MaximizeIcon className="w-5 h-5" /> : <MinimizeIcon className="w-5 h-5" />}
            </Button>
            <Button 
              onClick={toggleExpand} 
              variant="ghost" 
              size="sm" 
              className="p-1 text-[var(--text-on-dark-soft)]/80 hover:text-[var(--text-on-dark)]"
              title={windowSize === 'expanded' ? 'Restaurar tamaño' : 'Expandir'}
            >
              {windowSize === 'expanded' ? <MinimizeWindowIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
            </Button>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm" 
              className="p-1 text-[var(--text-on-dark-soft)]/80 hover:text-red-400"
              title="Cerrar chat"
            >
              <XCircleIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {windowSize !== 'minimized' && (
          <>
            <div 
              ref={chatContainerRef} 
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-[var(--deep-blue-dark)] shadow-inner"
              style={{ height: windowSize === 'expanded' ? 'calc(100% - 130px)' : 'calc(100% - 120px)' }}
            >
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md ${
                      msg.sender === 'user' 
                        ? 'bg-[var(--golden-accent)]/20 text-[var(--text-on-dark)] rounded-br-none border border-[var(--golden-accent)]/30' 
                        : 'bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)] rounded-bl-none border border-[var(--border-subtle)]/50'
                    }`}
                  >
                    {msg.image && (
                      <div className="mb-2">
                        <img 
                          src={msg.image.dataUrl} 
                          alt="Imagen adjunta" 
                          className="max-w-full rounded-lg max-h-40 object-contain" 
                        />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                    <p className="text-right text-xs mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)] rounded-bl-none border border-[var(--border-subtle)]/50">
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

            <div className="p-3 border-t border-[var(--border-subtle)]/30 bg-[var(--deep-blue-dark)] rounded-b-md">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 aspect-square"
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
                  placeholder="Escribe tu mensaje..."
                  className="flex-grow bg-[var(--deep-blue-dark)] border border-[var(--border-subtle)] text-[var(--text-on-dark)] rounded-lg p-2 focus:ring-2 focus:ring-[var(--golden-accent)] outline-none shadow-sm placeholder-[var(--text-on-dark-soft)]/60 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  isLoading={isLoading}
                  disabled={(!inputValue.trim() && !selectedFile) || isLoading}
                  variant="primary"
                  className="p-2 aspect-square" 
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </div>
            </div>
          </>
        )}
        
        {windowSize === 'minimized' && (
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm text-[var(--text-on-dark-soft)]/80 truncate">
              {lexiaContext.determinedArea.name}
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LexiaChatFloating;
