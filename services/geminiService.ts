

import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { LawAreaId, ChatMessage } from '../types';
import { LAW_AREAS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash-preview-04-17';

const chatInstances: Record<string, Chat> = {};
const lexiaChatInstances: Record<string, Chat> = {}; 

function getBasicSystemInstruction(areaId: LawAreaId): string {
  const area = LAW_AREAS.find(a => a.id === areaId);
  const areaName = area ? area.name : "legal general";
  return `Eres un asistente legal virtual de Ciberabogados especializado en ${areaName}. Tu objetivo es comprender la situación general del usuario y orientarlo sobre los próximos pasos o el tipo de servicio legal que podría necesitar. NO proporciones asesoramiento legal definitivo ni crees una relación abogado-cliente. Limítate a ofrecer información general y opciones. Haz preguntas claras y concisas para recopilar información. Si la consulta es muy compleja o requiere asesoramiento específico, recomienda al usuario que se ponga en contacto directamente con el bufete para una consulta formal. Mantén tus respuestas concisas y directas.`;
}

function getLexiaSystemInstruction(areaName: string, testContextSummary: string): string {
  return `Eres LexIA, un asesor legal inteligente avanzado de Ciberabogados, especializado en ${areaName}.
Tu interacción es parte de una consulta premium.
Contexto inicial del test del usuario: "${testContextSummary}". Utiliza esta información como punto de partida.

Tus responsabilidades principales son:
1.  **Diagnóstico Jurídico Fundamentado:** Analiza la situación del usuario, solicita detalles adicionales si es necesario (sé específico en tus preguntas). Proporciona un diagnóstico claro del problema legal, citando artículos de ley o jurisprudencia colombiana relevante cuando sea apropiado (ej. "Según el Artículo X del Código Y..."). Explica términos técnicos en lenguaje accesible.
2.  **Generación de Opciones Estratégicas:** Presenta al usuario dos (2) opciones estratégicas claras:
    *   **Opción 1 (Solución Autogestionada):** Si es viable y de bajo riesgo, describe los pasos que el usuario podría tomar por su cuenta (ej. enviar un derecho de petición, intentar una conciliación directa). Indica los pros y contras.
    *   **Opción 2 (Ruta con Asistencia Profesional):** Describe cómo un abogado especializado de Ciberabogados podría ayudar, qué tipo de acciones se tomarían (ej. representación en proceso, elaboración de demanda compleja).
3.  **Recomendación Clara:** Basado en el diagnóstico, recomienda si es indispensable o altamente recomendable la intervención de un abogado especializado. Justifica tu recomendación.
4.  **Próximos Pasos:** Sugiere los próximos pasos concretos que el usuario debería considerar.

**Comportamiento del Chat:**
*   Tono: Profesional, empático y accesible.
*   Preguntas: Específicas y dirigidas a obtener la información necesaria para el diagnóstico.
*   Análisis de Imágenes: Si el usuario sube una imagen (ej. foto de un documento), intenta analizar su contenido en el contexto de la consulta. Pide aclaraciones si la imagen no es clara o si necesitas más información relacionada con ella. Menciona que estás "revisando la imagen adjunta".
*   Limitaciones: Sé transparente sobre tus limitaciones como IA y que tu consejo no reemplaza una consulta formal con un abogado humano para decisiones críticas. No generes expectativas de una solución garantizada.
*   Concisión y Claridad: Evita respuestas excesivamente largas. Estructura tu respuesta final (diagnóstico, opciones, recomendación) de forma clara, quizás usando listados o párrafos separados para cada sección.

Mantén un historial de la conversación para dar respuestas coherentes. Inicia la conversación confirmando el área y el resumen del test, y luego pide al usuario que proporcione más detalles.`;
}

export const startChat = (areaId: LawAreaId, isLexia: boolean = false): Chat => {
  const instances = isLexia ? lexiaChatInstances : chatInstances;
  const key = `${areaId}-${isLexia ? 'lexia' : 'basic'}`;

  if (!instances[key]) {
    const systemInstruction = isLexia 
      ? "Placeholder: LexIA system instruction is set dynamically during message sending." 
      : getBasicSystemInstruction(areaId);

    instances[key] = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction,
        // Basic chat might benefit from slightly different settings or defaults
        // For now, keeping it simple. Could add specific config here if needed.
        // thinkingConfig is omitted to use default (enabled for higher quality)
        // or could be set: thinkingConfig: { thinkingBudget: 0 } for low latency basic.
      },
    });
  }
  return instances[key];
};

export const sendMessageToGemini = async ( 
  areaId: LawAreaId,
  message: string,
  _chatHistory: ChatMessage[] 
): Promise<string> => {
  const chat = startChat(areaId, false);
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    const textResponse = response.text;
    if (!textResponse) {
      return "No he podido procesar tu solicitud en este momento.";
    }
    return textResponse;
  } catch (error) {
    console.error("Error sending message to Gemini (basic):", error);
    return "Ha ocurrido un error al comunicarme con el asistente. Por favor, inténtalo de nuevo más tarde.";
  }
};

export const sendLexiaMessage = async (
  areaId: LawAreaId,
  message: string,
  _chatHistory: ChatMessage[], 
  testContextSummary: string,
  image?: { mimeType: string; data: string; } 
): Promise<string> => {
  const area = LAW_AREAS.find(a => a.id === areaId);
  const areaName = area ? area.name : "legal general";
  
  const lexiaChatKey = `${areaId}-lexia`;
  // Always ensure LexIA chat instance is created with the full, dynamic system instruction and specific generation config
  // This also handles re-creation if config parameters need to be precisely set per session/call
  lexiaChatInstances[lexiaChatKey] = ai.chats.create({
      model: modelName,
      config: {
          systemInstruction: getLexiaSystemInstruction(areaName, testContextSummary),
          temperature: 0.3,    // As per "Claude API" spec
          topP: 0.95,          // As per "Claude API" spec
          // topK: Default, or can be set e.g. 40
          maxOutputTokens: 1500 // Adjusted from 500 for potentially more detailed legal analysis
                                 // Max_tokens in user spec was 500 for Claude, 2000 for OpenAI. 
                                 // 1500 is a compromise for detailed chat.
          // thinkingConfig is omitted to use default (enabled for higher quality)
      },
  });
  const chat = lexiaChatInstances[lexiaChatKey];

  try {
    const messageParts: Part[] = [{ text: message }];
    if (image) {
      messageParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    // Fix: Changed `message: { parts: messageParts }` to `message: messageParts`.
    // The `sendMessage` method for `Chat` expects `message` to be `string` or `Part[]`.
    // When sending multi-part content (text + image), `messageParts` (which is `Part[]`)
    // should be directly assigned to the `message` property.
    const response: GenerateContentResponse = await chat.sendMessage({ message: messageParts });
    const textResponse = response.text;

    if (!textResponse) {
      return "LexIA no ha podido procesar tu solicitud en este momento. Intenta reformular tu pregunta o verifica la imagen si adjuntaste una.";
    }
    return textResponse;
  } catch (error) {
    console.error("Error sending message to LexIA:", error);
    if ((error as any).message?.includes('candidat')) { // Check for content filtering, more robust check might be needed
        return "LexIA no puede procesar esta solicitud debido a restricciones de contenido. Por favor, reformula tu pregunta o elimina cualquier contenido sensible de las imágenes.";
    }
    return "Ha ocurrido un error al comunicarme con LexIA. Por favor, inténtalo de nuevo más tarde. Si el problema persiste, contacta a soporte.";
  }
};


export const resetChatSession = (areaId: LawAreaId, isLexia: boolean = false): void => {
  const instances = isLexia ? lexiaChatInstances : chatInstances;
  const key = `${areaId}-${isLexia ? 'lexia' : 'basic'}`;
  if (instances[key]) {
    // Potentially call any cleanup on the Chat object if available/needed in future SDK versions
    delete instances[key];
  }
};