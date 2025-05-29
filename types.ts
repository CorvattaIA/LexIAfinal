
import { z } from 'zod';

export enum LawAreaId {
  PENAL = 'penal',
  CIVIL = 'civil',
  LABORAL = 'laboral',
  MERCANTIL = 'mercantil',
  FAMILIA = 'familia',
  ADMINISTRATIVO = 'administrativo',
  CYBER = 'cyber',
  AI_ETHICS = 'ai_ethics', 
}

// Zod schema for Registration
export const UserRegistrationSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres.").max(100, "El nombre no debe exceder los 100 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  interestedAreaId: z.nativeEnum(LawAreaId, {
    errorMap: () => ({ message: "Por favor, selecciona un área de interés válida." }),
  }),
  dataPolicyAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar la Política de Tratamiento de Datos para continuar.",
  }),
});

// Infer TypeScript type from Zod schema
export type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;


export interface LawArea {
  id: LawAreaId;
  name: string;
  description: string;
  icon?: React.ElementType;
  isFullyImplemented: boolean;
}

export interface StageOneQuestion {
  id: string;
  text: string;
  mapsToArea?: LawAreaId | LawAreaId[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  reference?: string;
}

export interface Answer {
  questionId: string;
  value: boolean | string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  area?: LawAreaId;
  image?: { 
    name: string;
    type: string; 
    dataUrl: string; 
  };
}


// Changed RegisteredUser to be a type intersection
export type RegisteredUser = UserRegistrationData & {
  id: string;
  createdAt: string;
  // interestedAreaId & dataPolicyAccepted are already part of UserRegistrationData
};

export enum TestStage {
  REGISTRATION = 'registration',
  STAGE_ONE = 'stage_one',
  STAGE_TWO = 'stage_two',
  RESULTS_SIMULATION = 'results_simulation',
  SERVICE_OPTIONS = 'service_options',
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  priceCOP: number;
  actionType: 'chat' | 'contact_form' | 'info' | 'document_request' | 'lexia_chat';
  targetAreaId?: LawAreaId;
  longDescription?: string; 
  features?: string[]; 
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  dataPolicyAccepted: boolean; // Added
}

export interface LexiaContext {
  determinedArea: LawArea;
  testAnswersSummary?: string; 
  userName?: string;
}

export enum PaymentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface TestResultSummary {
  userName: string;
  determinedAreaName: string;
  problemOverview?: string; 
}
