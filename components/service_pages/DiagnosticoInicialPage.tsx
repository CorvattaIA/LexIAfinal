

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  LAW_AREAS, 
  STAGE_ONE_QUESTIONS, 
  STAGE_TWO_QUESTIONS,
  SERVICE_OPTIONS, // May not be directly used here now, but kept for context
  ESTIMATED_TIME_STAGE_1,
  ESTIMATED_TIME_STAGE_2,
  RESULTS_SIMULATION_TEXT,
} from '../../constants';
import { 
  LawArea, LawAreaId, AssessmentQuestion, Answer, 
  TestStage, UserRegistrationData, RegisteredUser, ServiceOption, StageOneQuestion,
  LexiaContext, TestResultSummary, UserRegistrationSchema
} from '../../types';
import { saveUserRegistration } from '../../services/supabaseService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import PaymentModal from '../PaymentModal'; 
import LexiaChatFloating from '../LexiaChatFloating'; 

// Icons from AssessmentTest can be reused or made global if needed
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const StepIcon = ({ number }: { number: number }) => (
    <div className="w-8 h-8 rounded-full bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] flex items-center justify-center font-bold text-lg font-title mr-3 flex-shrink-0">
        {number}
    </div>
);


interface DiagnosticoInicialPageProps {
  currentUser: RegisteredUser | null;
  setCurrentUser: (user: RegisteredUser | null) => void;
}

const DiagnosticoInicialPage: React.FC<DiagnosticoInicialPageProps> = ({ currentUser, setCurrentUser }) => {
  // Inicializar el estado del test basado en si hay un usuario o no
  const initialTestStage = currentUser ? TestStage.STAGE_ONE : TestStage.REGISTRATION;
  
  const [currentTestStage, setCurrentTestStage] = useState<TestStage>(initialTestStage);
  const [determinedArea, setDeterminedArea] = useState<LawArea | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [stageOneAnswers, setStageOneAnswers] = useState<Answer[]>([]);
  const [stageTwoAnswers, setStageTwoAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null); 
  // Agregar un estado para controlar si el componente está inicializado
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<ServiceOption | null>(null);
  const [currentLexiaContext, setCurrentLexiaContext] = useState<LexiaContext | null>(null);
  const [showLexiaChat, setShowLexiaChat] = useState<boolean>(false);

  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid: isRegistrationFormValid },
    reset: resetRegistrationForm,
    watch
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(UserRegistrationSchema),
    mode: 'onChange', 
    defaultValues: { name: '', email: '', interestedAreaId: undefined, dataPolicyAccepted: false }
  });

  const dataPolicyAcceptedWatcher = watch("dataPolicyAccepted");

  // useEffect para inicializar el componente y manejar cambios en el usuario
  useEffect(() => {
    if (currentUser) {
      setCurrentTestStage(TestStage.STAGE_ONE);
      // Asegurarse de que el índice de preguntas esté en 0 al iniciar
      setCurrentQuestionIndex(0);
      // Limpiar respuestas previas
      setStageOneAnswers([]);
      setStageTwoAnswers([]);
    } else {
      setCurrentTestStage(TestStage.REGISTRATION);
      resetRegistrationForm(); 
    }
    // Marcar el componente como inicializado
    setIsInitialized(true);
  }, [currentUser, resetRegistrationForm]);
  
  // useEffect adicional para asegurar que siempre tengamos un estado válido
  useEffect(() => {
    // Si el componente está inicializado pero no tenemos un estado válido, forzar uno
    if (isInitialized && 
        currentTestStage !== TestStage.REGISTRATION && 
        currentTestStage !== TestStage.STAGE_ONE && 
        currentTestStage !== TestStage.STAGE_TWO && 
        currentTestStage !== TestStage.RESULTS_SIMULATION && 
        currentTestStage !== TestStage.SERVICE_OPTIONS) {
      // Forzar un estado válido basado en si hay un usuario o no
      if (currentUser) {
        setCurrentTestStage(TestStage.STAGE_ONE);
        setCurrentQuestionIndex(0);
      } else {
        setCurrentTestStage(TestStage.REGISTRATION);
      }
    }
  }, [isInitialized, currentTestStage, currentUser]);

  const onRegistrationSubmit: SubmitHandler<UserRegistrationData> = async (data) => {
    setIsLoading(true);
    setSubmitError(null);
    const result = await saveUserRegistration(data);
    setIsLoading(false);
    if (result.error) {
      setSubmitError(`Error en el registro: ${result.error.message || 'Intente nuevamente.'}`);
    } else if (result.data) {
      setCurrentUser(result.data);
      resetRegistrationForm(); 
    }
  };

  const handleAnswer = (questionId: string, value: boolean | string) => {
    if (currentTestStage === TestStage.STAGE_ONE) {
      // Añadir respuesta a las respuestas de la etapa uno
      const newAnswers = [...stageOneAnswers, { questionId, value }];
      setStageOneAnswers(newAnswers);
      
      // Si hemos llegado al final de las preguntas de la etapa uno
      if (currentQuestionIndex >= STAGE_ONE_QUESTIONS.length - 1) {
        // Contar votos para cada área basado en las respuestas
        const areaCounts: Record<string, number> = {};
        newAnswers.forEach(answer => {
          const question = STAGE_ONE_QUESTIONS.find(q => q.id === answer.questionId);
          if (question && question.mapsToArea && answer.value === true) {
            if (Array.isArray(question.mapsToArea)) {
              question.mapsToArea.forEach(area => {
                areaCounts[area] = (areaCounts[area] || 0) + 1;
              });
            } else {
              areaCounts[question.mapsToArea] = (areaCounts[question.mapsToArea] || 0) + 1;
            }
          }
        });
        
        // Encontrar el área con más votos
        let primaryAreaId: LawAreaId | null = null;
        let maxCount = 0;
        for (const [areaId, count] of Object.entries(areaCounts)) {
          if (count > maxCount) {
            maxCount = count;
            primaryAreaId = areaId as LawAreaId;
          }
        }
        
        // Encontrar el área correspondiente en LAW_AREAS
        const area = LAW_AREAS.find(area => area.id === primaryAreaId) || 
                     LAW_AREAS.find(area => area.isFullyImplemented) || 
                     LAW_AREAS[0];
        
        setDeterminedArea(area);
        
        // Si el área está completamente implementada y tiene preguntas en la etapa dos
        if (area.isFullyImplemented && STAGE_TWO_QUESTIONS[area.id]?.length > 0) {
          setCurrentTestStage(TestStage.STAGE_TWO);
          setCurrentQuestionIndex(0);
        } else {
          // Si no hay preguntas específicas, simular procesamiento y mostrar resultados
          setCurrentTestStage(TestStage.RESULTS_SIMULATION);
          setTimeout(() => setCurrentTestStage(TestStage.SERVICE_OPTIONS), 1500);
        }
      } else {
        // Pasar a la siguiente pregunta en la etapa uno
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } else if (currentTestStage === TestStage.STAGE_TWO && determinedArea) {
      // Añadir respuesta a las respuestas de la etapa dos
      const newAnswers = [...stageTwoAnswers, { questionId, value }];
      setStageTwoAnswers(newAnswers);
      
      // Si hemos llegado al final de las preguntas de la etapa dos
      const areaQuestions = STAGE_TWO_QUESTIONS[determinedArea.id] || [];
      if (currentQuestionIndex >= areaQuestions.length - 1) {
        // Ir a los resultados
        setCurrentTestStage(TestStage.RESULTS_SIMULATION);
        setTimeout(() => {
          setCurrentTestStage(TestStage.SERVICE_OPTIONS);
        }, 1500);
      } else {
        // Pasar a la siguiente pregunta en la etapa dos
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handleServiceOptionClick = (option: ServiceOption) => {
    if (option.actionType === 'lexia_chat' && determinedArea) {
      // Preparar un contexto más detallado para LexIA basado en los resultados del test
      const summaryParts: string[] = [];
      
      // Añadir información sobre las respuestas de la etapa dos
      stageTwoAnswers.forEach(ans => {
        const q = STAGE_TWO_QUESTIONS[determinedArea.id]?.find(q => q.id === ans.questionId);
        if(q && ans.value === true) {
          summaryParts.push(`En ${determinedArea.name}, indicó sí a: "${q.text}"${q.reference ? ` (Ref: ${q.reference})` : ''}`);
        }
      });
      
      // Generar un resumen más completo del diagnóstico
      let testAnswersSummary = "";
      if (summaryParts.length > 0) {
        testAnswersSummary = `Diagnóstico preliminar para ${determinedArea.name}: ${summaryParts.join('. ')}`;
      } else {
        testAnswersSummary = `Su consulta está relacionada con ${determinedArea.name}, pero no proporcionó detalles específicos en el test diagnóstico.`;
      }
      
      // Añadir información sobre el marco legal aplicable
      let marcoLegal = "";
      switch(determinedArea.id) {
        case LawAreaId.LABORAL:
          marcoLegal = "Código Sustantivo del Trabajo, Constitución Política Art. 25, Jurisprudencia laboral";
          break;
        case LawAreaId.PENAL:
          marcoLegal = "Código Penal (Ley 599 de 2000), Código de Procedimiento Penal (Ley 906 de 2004)";
          break;
        case LawAreaId.FAMILIA:
          marcoLegal = "Código Civil, Ley 1098 de 2006 (Infancia y Adolescencia), Leyes especiales de familia";
          break;
        case LawAreaId.CIVIL:
          marcoLegal = "Código Civil, Código General del Proceso, Jurisprudencia civil";
          break;
        case LawAreaId.MERCANTIL:
          marcoLegal = "Código de Comercio, Ley 1258 de 2008, Legislación mercantil especial";
          break;
        case LawAreaId.ADMINISTRATIVO:
          marcoLegal = "CPACA, Ley 1437 de 2011, Ley 80 de 1993, Ley 1150 de 2007";
          break;
        case LawAreaId.CYBER:
          marcoLegal = "Ley 1273 de 2009, Ley 1581 de 2012, Ley 527 de 1999";
          break;
        case LawAreaId.AI_ETHICS:
          marcoLegal = "Ley 1581 de 2012, Estándares internacionales, Principios éticos de IA";
          break;
      }
      
      if (marcoLegal) {
        testAnswersSummary += ` Marco legal aplicable: ${marcoLegal}.`;
      }
      
      // Crear un contexto enriquecido para LexIA
      const lexiaCtx: LexiaContext = {
        determinedArea: determinedArea, 
        testAnswersSummary: testAnswersSummary, 
        userName: currentUser?.name || "Usuario"
      };
      
      setCurrentLexiaContext(lexiaCtx);
      setSelectedServiceForPayment(option);
      setShowPaymentModal(true);
    } else if (option.id === 'auto_asistencia_lexia' && determinedArea) { // Navegación específica para la página LexIA DIY
      navigate('/auto-asistencia-lexia', { 
        state: { 
          determinedArea,
          // Pasar también un resumen del diagnóstico para la auto-asistencia
          diagnosticSummary: stageTwoAnswers
            .filter(ans => ans.value === true)
            .map(ans => {
              const q = STAGE_TWO_QUESTIONS[determinedArea.id]?.find(q => q.id === ans.questionId);
              return q ? q.text : null;
            })
            .filter(Boolean)
            .join('. ')
        } 
      });
    } else if (option.actionType === 'contact_form') {
      navigate(`/contact?service=${encodeURIComponent(option.title)}`);
    } else {
      navigate(`/services`); // Por defecto, ir a la vista general de servicios
    }
  };

  const handlePaymentSuccessForLexia = () => {
    // En lugar de navegar inmediatamente, mostrar el chat flotante
    if (currentLexiaContext) {
      setShowLexiaChat(true);
    }
    setShowPaymentModal(false);
  };
  
  const handleCloseChat = () => {
    setShowLexiaChat(false);
  };

  const resetTestProgress = (backToStageOne = true) => {
    if(backToStageOne){
        setCurrentTestStage(TestStage.STAGE_ONE);
        setDeterminedArea(null); 
    } else { 
        setCurrentTestStage(TestStage.REGISTRATION); 
        setDeterminedArea(null);
        if(!currentUser) resetRegistrationForm(); 
    }
    setCurrentQuestionIndex(0); setStageOneAnswers([]); setStageTwoAnswers([]); setSubmitError(null);
    setShowPaymentModal(false); setSelectedServiceForPayment(null); setCurrentLexiaContext(null);
    setShowLexiaChat(false);
  };

  // Fix: Uncommented and ensured variables are in scope
  const renderProgressBar = () => { 
    let totalQuestions = 0; 
    let currentProgress = 0; 
    let estimatedTime = "";
    
    // Fix: Check currentTestStage from state
    if (currentTestStage === TestStage.STAGE_ONE) {
      totalQuestions = STAGE_ONE_QUESTIONS.length; 
      // Fix: Check currentQuestionIndex from state
      currentProgress = currentQuestionIndex; 
      estimatedTime = ESTIMATED_TIME_STAGE_1;
    // Fix: Check currentTestStage, determinedArea from state
    } else if (currentTestStage === TestStage.STAGE_TWO && determinedArea && determinedArea.isFullyImplemented) {
      // Fix: Check determinedArea from state
      totalQuestions = (STAGE_TWO_QUESTIONS[determinedArea.id] || []).length; 
      // Fix: Check currentQuestionIndex from state
      currentProgress = currentQuestionIndex; 
      estimatedTime = ESTIMATED_TIME_STAGE_2;
    } else { 
      return null; 
    }
    if (totalQuestions === 0) return null;
    const progressPercentage = (currentProgress / totalQuestions) * 100;
    // Fix: Use JSX div element
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-[var(--golden-accent)]">Progreso</span>
          <span className="text-sm font-medium text-[var(--text-on-dark-soft)]/70">{estimatedTime}</span>
        </div>
        <div className="w-full bg-[var(--deep-blue-dark)] rounded-full h-2.5 border border-[var(--border-subtle)]/50">
          <div className="bg-[var(--golden-accent)] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    );
  }
  
  const inputBaseClasses = `block w-full bg-[var(--deep-blue-dark)] border border-[var(--border-subtle)] rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--golden-accent)] sm:text-sm text-[var(--text-on-dark)] placeholder-[var(--text-on-dark-soft)]/60`;
  const inputErrorClasses = `border-red-500 focus:ring-red-500`;
  const inputValidClasses = `border-[var(--border-subtle)] focus:ring-[var(--golden-accent)]`;

  // HERO SECTION FOR DIAGNOSTICO INICIAL
  // Fix: Check currentTestStage from state and currentUser from props
  if (currentTestStage === TestStage.REGISTRATION && !currentUser) {
    return (
      <div className="py-12 md:py-16">
        <section className="text-center px-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-title text-[var(--sky-blue-light)]">Diagnóstico Legal Inicial</h1>
            <p className="text-lg md:text-xl text-[var(--text-on-dark-soft)]/90 mb-3 max-w-2xl mx-auto">
                Nuestro test inteligente es el primer paso para entender tu situación legal. Es <strong className="text-[var(--golden-accent)]">GRATUITO</strong> y te proporcionará una orientación valiosa.
            </p>
            <span className="inline-block px-4 py-1 bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] font-bold text-sm rounded-full uppercase tracking-wider">Gratuito con Registro</span>
        </section>

        <section className="max-w-3xl mx-auto px-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 font-title text-[var(--text-on-dark)]">¿Cómo Funciona?</h2>
            <div className="space-y-6">
                <div className="flex items-start"><StepIcon number={1} /><p className="text-[var(--text-on-dark-soft)]/85">Regístrate con tus datos básicos para acceder al test.</p></div>
                <div className="flex items-start"><StepIcon number={2} /><p className="text-[var(--text-on-dark-soft)]/85">Selecciona el área legal general que consideras relevante para tu caso.</p></div>
                <div className="flex items-start"><StepIcon number={3} /><p className="text-[var(--text-on-dark-soft)]/85">Responde a una serie de preguntas específicas diseñadas por nuestros expertos para entender los detalles clave.</p></div>
                <div className="flex items-start"><StepIcon number={4} /><p className="text-[var(--text-on-dark-soft)]/85">Recibe un diagnóstico básico preliminar con la identificación del área de derecho y recomendaciones generales.</p></div>
            </div>
        </section>
        
        {/* Registration Form (same as before) */}
        <Card className="max-w-lg mx-auto p-8 md:p-10">
          <h3 className="text-2xl font-bold text-center mb-6 font-title text-[var(--sky-blue-light)]">Regístrate para comenzar tu diagnóstico</h3>
          <form onSubmit={handleSubmit(onRegistrationSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-[var(--text-on-dark-soft)]/50" /></div>
                <input type="text" id="name" {...register("name")} className={`${inputBaseClasses} pl-10 ${errors.name ? inputErrorClasses : inputValidClasses}`} placeholder="Tu nombre"/>
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Correo electrónico</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="h-5 w-5 text-[var(--text-on-dark-soft)]/50" /></div>
                  <input type="email" id="email" {...register("email")} className={`${inputBaseClasses} pl-10 ${errors.email ? inputErrorClasses : inputValidClasses}`} placeholder="tu@email.com"/>
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="interestedAreaId" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Área de interés inicial</label>
              <select id="interestedAreaId" {...register("interestedAreaId")} className={`${inputBaseClasses} ${errors.interestedAreaId ? inputErrorClasses : inputValidClasses}`}>
                  <option value="" className="text-[var(--text-on-dark-soft)]/70">Selecciona un área...</option>
                  {LAW_AREAS.map(area => (<option key={area.id} value={area.id} className="bg-[var(--deep-blue-dark)] text-[var(--text-on-dark)]">{area.name}</option>))}
              </select>
              {errors.interestedAreaId && <p className="mt-1 text-xs text-red-400">{errors.interestedAreaId.message}</p>}
            </div>
            <div className="flex items-start space-x-3">
              <input id="dataPolicyAccepted" type="checkbox" {...register("dataPolicyAccepted")} className="h-4 w-4 mt-0.5 text-[var(--golden-accent)] border-[var(--border-subtle)] rounded focus:ring-2 focus:ring-[var(--golden-accent)] bg-[var(--deep-blue-dark)] accent-[var(--golden-accent)]"/>
              <label htmlFor="dataPolicyAccepted" className="text-xs text-[var(--text-on-dark-soft)]/70">He leído y acepto la <Link to="/data-policy" className="underline text-[var(--sky-blue-light)] hover:text-[var(--golden-accent)]" target="_blank" rel="noopener noreferrer">Política de Tratamiento de Datos</Link>.</label>
            {/* Fix: Removed erroneous closing </label> tag */}
            </div>
            {errors.dataPolicyAccepted && <p className="mt-1 text-xs text-red-400">{errors.dataPolicyAccepted.message}</p>}
            {submitError && <p className="text-sm text-red-400 text-center">{submitError}</p>}
            <Button type="submit" isLoading={isLoading} variant="primary" className="w-full py-3 text-base" disabled={!isRegistrationFormValid || isLoading || !dataPolicyAcceptedWatcher}>
              Registrarse y comenzar
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // STAGE ONE and STAGE TWO Test rendering logic (largely same as AssessmentTest)
  const questionsForStageOne = STAGE_ONE_QUESTIONS;
  const currentStageOneQuestion: StageOneQuestion | undefined = questionsForStageOne[currentQuestionIndex];
  // Fix: Check determinedArea from state
  const questionsForStageTwo = determinedArea ? (STAGE_TWO_QUESTIONS[determinedArea.id] || []) : [];
  const currentStageTwoQuestion: AssessmentQuestion | undefined = questionsForStageTwo[currentQuestionIndex];

  // Fix: Check currentTestStage from state
  if (currentTestStage === TestStage.STAGE_ONE && currentStageOneQuestion) {
    return ( 
      <Card className="max-w-2xl mx-auto mt-10 p-8 md:p-10">
        {renderProgressBar()}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 font-title text-[var(--sky-blue-light)]">Diagnóstico - Etapa 1: Clasificación</h2>
        <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-8">Pregunta {currentQuestionIndex + 1} de {questionsForStageOne.length}. Responde para identificar el área principal de tu consulta.</p>
        <div className="text-center"><p className="text-lg md:text-xl text-[var(--text-on-dark)] mb-2">{currentStageOneQuestion.text}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <Button onClick={() => handleAnswer(currentStageOneQuestion.id, true)} variant="primary" size="lg" className="w-full sm:w-auto">Sí</Button>
            <Button onClick={() => handleAnswer(currentStageOneQuestion.id, false)} variant="secondary" size="lg" className="w-full sm:w-auto">No</Button>
          </div>
        </div>
      </Card>
    );
  }
  
  // Fix: Check currentTestStage and determinedArea from state
  if (currentTestStage === TestStage.STAGE_TWO && determinedArea) { 
    // Fix: Check determinedArea from state
    if (!determinedArea.isFullyImplemented || !currentStageTwoQuestion) {
       return (
        <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 font-title text-[var(--sky-blue-light)]">Área: {determinedArea.name}</h3>
            <p className="text-[var(--text-on-dark-soft)]/90 mb-6">Las preguntas específicas para el área de {determinedArea.name} están siendo desarrolladas o esta área no requiere diagnóstico detallado en el test gratuito. Puedes proceder a ver nuestras opciones de servicio.</p>
            <div className="space-y-3">
                <Button onClick={() => { setCurrentTestStage(TestStage.RESULTS_SIMULATION); setTimeout(() => setCurrentTestStage(TestStage.SERVICE_OPTIONS), 1000);}} variant="primary">Ver opciones de servicio</Button>
                <Button onClick={() => resetTestProgress(true)} variant="secondary">Volver a Clasificación (Etapa 1)</Button>
            </div>
        </Card>
       );
    }
    return (
      <Card className="max-w-2xl mx-auto mt-10 p-8 md:p-10">
        {renderProgressBar()}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 font-title text-[var(--sky-blue-light)]">Diagnóstico - Etapa 2: Detalle</h2>
        <p className="text-center text-sm text-[var(--text-on-dark-soft)]/70 mb-1">Área: {determinedArea.name}</p>
        <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-6">Pregunta {currentQuestionIndex + 1} de {questionsForStageTwo.length}.</p>
        <div className="text-center"><p className="text-lg md:text-xl text-[var(--text-on-dark)] mb-2">{currentStageTwoQuestion.text}</p>
          {currentStageTwoQuestion.reference && (<p className="text-xs text-[var(--golden-accent)]/80 mb-6">Referencia legal (informativa): {currentStageTwoQuestion.reference}</p>)}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <Button onClick={() => handleAnswer(currentStageTwoQuestion.id, true)} variant="primary" size="lg" className="w-full sm:w-auto">Sí</Button>
            <Button onClick={() => handleAnswer(currentStageTwoQuestion.id, false)} variant="secondary" size="lg" className="w-full sm:w-auto">No</Button>
          </div>
           <div className="mt-10"><Button onClick={() => resetTestProgress(true)} variant="outline" size="sm">Reiniciar test (Etapa 1)</Button></div>
        </div>
      </Card>
    );
  }

  // Fix: Check currentTestStage from state
  if (currentTestStage === TestStage.RESULTS_SIMULATION) { 
    return (
      <Card className="max-w-lg mx-auto mt-20 p-10 text-center">
         <div className="flex justify-center mb-6">
            <svg className="animate-spin h-12 w-12 text-[var(--golden-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
         </div>
        <h3 className="text-2xl font-semibold mb-3 text-[var(--text-on-dark-soft)] font-title">{RESULTS_SIMULATION_TEXT}</h3>
        <p className="text-[var(--text-on-dark-soft)]/70">Esto tomará solo un momento.</p>
      </Card>
    );
  }
  
  // SERVICE OPTIONS (POST-DIAGNOSTIC) - Adapting to link to new service pages or specific actions
  // Fix: Check currentTestStage from state
  if (currentTestStage === TestStage.SERVICE_OPTIONS) {
    const resultSummary: TestResultSummary = {
        // Fix: Check currentUser from props
        userName: currentUser?.name || "Usuario",
        // Fix: Check determinedArea from state
        determinedAreaName: determinedArea?.name || "No determinada"
    };

    // Define specific service options post-diagnostic. This can be more targeted than full MCP.
    const postDiagnosticServices = [
        SERVICE_OPTIONS.find(s => s.id === 'lexia_premium_chat'), // LexIA Chat
        SERVICE_OPTIONS.find(s => s.id === 'auto_asistencia_lexia') || SERVICE_OPTIONS.find(s => s.title.includes("Auto-Asistencia Legal")), // Auto-Asistencia / LexIA DIY
        SERVICE_OPTIONS.find(s => s.id === 'reporte_estrategico') || SERVICE_OPTIONS.find(s => s.title.includes("Reporte Estratégico Híbrido")),
    ].filter(Boolean) as ServiceOption[];


    return (
      <div className="py-8">
        <section className="text-center mb-12 px-4">
            <CheckCircleIcon className="w-16 h-16 text-[var(--golden-accent)] mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-[var(--sky-blue-light)] font-title mb-3">Diagnóstico Preliminar Completado</h2>
            <p className="text-lg text-[var(--text-on-dark-soft)]/80 max-w-2xl mx-auto">Gracias {resultSummary.userName}. {determinedArea && `Tu consulta parece estar relacionada principalmente con ${resultSummary.determinedAreaName}.`}</p>
            <p className="text-md text-[var(--text-on-dark-soft)]/70 mt-2 max-w-2xl mx-auto">Este es un primer paso. Considera las siguientes opciones para profundizar:</p>
        </section>
        
        {/* Resumen del diagnóstico basado en las respuestas del usuario */}
        <Card className="max-w-2xl mx-auto mb-12 p-6 bg-[var(--surface-subtle)]/50 border border-[var(--border-subtle)]/30">
            <h3 className="text-xl font-semibold text-center text-[var(--text-on-dark)] font-title mb-3">Resumen del Diagnóstico</h3>
            <div className="text-sm text-[var(--text-on-dark-soft)]/85 space-y-4">
                <div>
                    <h4 className="font-semibold text-[var(--golden-accent)] mb-1">Área legal identificada:</h4>
                    <p className="pl-2">{determinedArea?.name || "General"}</p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-[var(--golden-accent)] mb-1">Aspectos clave de su situación:</h4>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                        {stageTwoAnswers.length > 0 ? (
                            stageTwoAnswers.map((ans, index) => {
                                const q = determinedArea ? STAGE_TWO_QUESTIONS[determinedArea.id]?.find(q => q.id === ans.questionId) : null;
                                if (q && ans.value) {
                                    return <li key={index}>{q.text.replace(/¿|\?/g, '')}</li>;
                                }
                                return null;
                            }).filter(Boolean)
                        ) : (
                            <li>Basado en sus respuestas iniciales, su consulta está relacionada con {determinedArea?.name}.</li>
                        )}
                        {stageTwoAnswers.filter(ans => ans.value).length === 0 && stageTwoAnswers.length > 0 && (
                            <li>No ha confirmado aspectos específicos en el diagnóstico detallado.</li>
                        )}
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-semibold text-[var(--golden-accent)] mb-1">Recomendación:</h4>
                    <p className="pl-2">
                        {stageTwoAnswers.filter(ans => ans.value).length >= 2 ? 
                            "Su caso presenta varios elementos relevantes que requieren un análisis legal detallado. Recomendamos consultar con LexIA para una evaluación personalizada." :
                            "Para obtener una orientación inicial sobre su situación, recomendamos explorar Auto-Asistencia con LexIA o solicitar una consulta personalizada."}
                    </p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-[var(--golden-accent)] mb-1">Marco legal aplicable:</h4>
                    <p className="pl-2">
                        {determinedArea?.id === LawAreaId.LABORAL && "Código Sustantivo del Trabajo, Constitución Política Art. 25, Jurisprudencia laboral"}
                        {determinedArea?.id === LawAreaId.PENAL && "Código Penal (Ley 599 de 2000), Código de Procedimiento Penal (Ley 906 de 2004)"}
                        {determinedArea?.id === LawAreaId.FAMILIA && "Código Civil, Ley 1098 de 2006 (Infancia y Adolescencia), Leyes especiales de familia"}
                        {determinedArea?.id === LawAreaId.CIVIL && "Código Civil, Código General del Proceso, Jurisprudencia civil"}
                        {determinedArea?.id === LawAreaId.MERCANTIL && "Código de Comercio, Ley 1258 de 2008, Legislación mercantil especial"}
                        {determinedArea?.id === LawAreaId.ADMINISTRATIVO && "CPACA, Ley 1437 de 2011, Ley 80 de 1993, Ley 1150 de 2007"}
                        {determinedArea?.id === LawAreaId.CYBER && "Ley 1273 de 2009, Ley 1581 de 2012, Ley 527 de 1999"}
                        {determinedArea?.id === LawAreaId.AI_ETHICS && "Ley 1581 de 2012, Estándares internacionales, Principios éticos de IA"}
                    </p>
                </div>
            </div>
        </Card>


        <section className="max-w-4xl mx-auto px-4">
             <h3 className="text-2xl font-bold text-center mb-8 font-title text-[var(--sky-blue-light)]">Próximos Pasos Sugeridos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postDiagnosticServices.map((option) => (
                <Card key={option.id} className="flex flex-col text-left p-6 h-full">
                  <h4 className="text-xl font-semibold text-[var(--golden-accent)] mb-2 font-title">{option.title}</h4>
                  <p className="text-lg font-semibold text-[var(--text-on-dark)] mb-3">{option.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits:0 })}</p>
                  <p className="text-sm text-[var(--text-on-dark-soft)]/80 mb-4 flex-grow">{option.description}</p>
                  <div className="mt-auto">
                    <Button onClick={() => handleServiceOptionClick(option)} variant={option.actionType === 'lexia_chat' ? "primary" : "secondary"} className="w-full py-2.5">
                      {option.actionType === 'lexia_chat' ? "Consultar con LexIA" : 
                       (option.id === 'auto_asistencia_lexia' ? "Ver Auto-Asistencia LexIA" : "Ver más detalles")}
                    </Button>
                  </div>
                </Card>
              ))}
               <Card className="flex flex-col text-left p-6 h-full border-dashed border-2 border-[var(--border-subtle)]/50 hover:border-[var(--golden-accent)]">
                  <h4 className="text-xl font-semibold text-[var(--golden-accent)] mb-2 font-title">Ver todos los servicios</h4>
                   <p className="text-sm text-[var(--text-on-dark-soft)]/80 mb-4 flex-grow">Explora nuestra gama completa de servicios legales progresivos, desde auto-asistencia hasta representación integral.</p>
                   <div className="mt-auto">
                      <Link to="/services">
                          <Button variant="outline" className="w-full py-2.5">Explorar todos los servicios</Button>
                      </Link>
                   </div>
               </Card>
            </div>
        </section>
        
        <div className="text-center mt-12">
            <Button onClick={() => resetTestProgress(false)} variant="outline">Realizar Nuevo Diagnóstico</Button>
        </div>
        {showPaymentModal && selectedServiceForPayment && (
          <PaymentModal 
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={handlePaymentSuccessForLexia}
            service={selectedServiceForPayment}
          />
        )}
        
        {/* Chat flotante de LexIA que aparece después del pago exitoso */}
        {showLexiaChat && currentLexiaContext && (
          <LexiaChatFloating
            lexiaContext={currentLexiaContext}
            onClose={handleCloseChat}
          />
        )}
      </div>
    );
  }

  // Si llegamos aquí, significa que ninguna de las condiciones anteriores se cumplió
  // Esto podría ocurrir durante la inicialización o en un estado no manejado
  
  // Si el componente está inicializado pero aún estamos en este punto, algo no está funcionando correctamente
  // Mostrar una interfaz que permita al usuario reiniciar el test o volver a la página principal
  if (isInitialized) {
    return (
      <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4 text-[var(--sky-blue-light)] font-title">Diagnóstico Legal</h3>
        <p className="text-[var(--text-on-dark-soft)]/90 mb-6">Estamos experimentando un problema al cargar el test diagnóstico. Por favor, intenta una de las siguientes opciones:</p>
        <div className="space-y-4">
          <Button 
            onClick={() => {
              // Reiniciar completamente el estado del test
              setCurrentTestStage(currentUser ? TestStage.STAGE_ONE : TestStage.REGISTRATION);
              setCurrentQuestionIndex(0);
              setStageOneAnswers([]);
              setStageTwoAnswers([]);
              setDeterminedArea(null);
            }} 
            variant="primary" 
            className="w-full"
          >
            Reiniciar Diagnóstico
          </Button>
          <Link to="/">
            <Button variant="outline" className="w-full">Volver a la Página Principal</Button>
          </Link>
        </div>
      </Card>
    );
  }
  
  // Durante la inicialización inicial, mostrar un mensaje de carga
  return (
    <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
      <div className="flex justify-center mb-6">
        <svg className="animate-spin h-10 w-10 text-[var(--golden-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-center text-lg text-[var(--text-on-dark-soft)]">Preparando el test diagnóstico...</p>
    </Card>
  );
};

export default DiagnosticoInicialPage;