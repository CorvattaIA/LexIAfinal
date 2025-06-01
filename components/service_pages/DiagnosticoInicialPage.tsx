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
} from '../../constants';
import { 
  LawArea, LawAreaId, AssessmentQuestion, Answer, 
  TestStage, UserRegistrationData, RegisteredUser, ServiceOption, StageOneQuestion,
  LexiaContext, UserRegistrationSchema
} from '../../types';
import { saveUserRegistration } from '../../services/supabaseService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';
import Layout from '../layout/Layout';
import LexiaChatFloating from '../LexiaChatFloating';

// Componente para los pasos del proceso
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-title text-[var(--coal)]">¿Cómo Funciona?</h2>
            <div className="space-y-6">
                <div className="flex items-start"><StepIcon number={1} /><p className="text-[var(--coal)]">Regístrate con tus datos básicos para acceder al test.</p></div>
                <div className="flex items-start"><StepIcon number={2} /><p className="text-[var(--coal)]">Selecciona el área legal general que consideras relevante para tu caso.</p></div>
                <div className="flex items-start"><StepIcon number={3} /><p className="text-[var(--coal)]">Responde a una serie de preguntas específicas diseñadas por nuestros expertos para entender los detalles clave.</p></div>
                <div className="flex items-start"><StepIcon number={4} /><p className="text-[var(--coal)]">Recibe un diagnóstico básico preliminar con la identificación del área de derecho y recomendaciones generales.</p></div>
            </div>
        </section>
        
        {/* Registration Form (same as before) */}
        <Card className="max-w-lg mx-auto p-8 md:p-10">
          <h3 className="text-2xl font-bold text-center mb-6 font-title text-[var(--sky-blue-light)]">Regístrate para comenzar tu diagnóstico</h3>
          <form onSubmit={handleSubmit(onRegistrationSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon name="user" size="sm" color="muted" /></div>
                <input type="text" id="name" {...register("name")} className={`${inputBaseClasses} pl-10 ${errors.name ? inputErrorClasses : inputValidClasses}`} placeholder="Tu nombre"/>
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Correo electrónico</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon name="mail" size="sm" color="muted" /></div>
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

  // Fix: Check currentTestStage from state and currentStageOneQuestion
  if (currentTestStage === TestStage.STAGE_ONE && currentStageOneQuestion) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto mt-10 p-8 md:p-10">
            {renderProgressBar()}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 font-title text-[var(--sky-blue-light)]">Diagnóstico - Etapa 1: Clasificación</h2>
            <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-8">Pregunta {currentQuestionIndex + 1} de {questionsForStageOne.length}. Responde para identificar el área principal de tu consulta.</p>
            <div className="text-center">
              <p className="text-lg md:text-xl text-[var(--text-on-dark)] mb-2">{currentStageOneQuestion.text}</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                <Button onClick={() => handleAnswer(currentStageOneQuestion.id, true)} variant="primary" size="lg" className="w-full sm:w-auto">Sí</Button>
                <Button onClick={() => handleAnswer(currentStageOneQuestion.id, false)} variant="secondary" size="lg" className="w-full sm:w-auto">No</Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // Fix: Check currentTestStage and determinedArea from state
  if (currentTestStage === TestStage.STAGE_TWO && determinedArea) { 
    // Fix: Check determinedArea from state
    if (!determinedArea.isFullyImplemented || !currentStageTwoQuestion) {
       return (
        <Layout>
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 font-title text-[var(--sky-blue-light)]">Área: {determinedArea.name}</h3>
              <p className="text-[var(--text-on-dark-soft)]/90 mb-6">Las preguntas específicas para el área de {determinedArea.name} están siendo desarrolladas o esta área no requiere diagnóstico detallado en el test gratuito. Puedes proceder a ver nuestras opciones de servicio.</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => { 
                    setCurrentTestStage(TestStage.RESULTS_SIMULATION); 
                    setTimeout(() => setCurrentTestStage(TestStage.SERVICE_OPTIONS), 1000);
                  }} 
                  variant="primary"
                  iconName="arrow-right"
                  iconPosition="right"
                >
                  Ver opciones de servicio
                </Button>
                <Button 
                  onClick={() => resetTestProgress(true)} 
                  variant="secondary"
                  iconName="arrow-left"
                  iconPosition="left"
                >
                  Volver a Clasificación (Etapa 1)
                </Button>
              </div>
            </Card>
          </div>
        </Layout>
       );
    }
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto mt-10 p-8 md:p-10">
            {renderProgressBar()}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 font-title text-[var(--sky-blue-light)]">Diagnóstico - Etapa 2: Detalle</h2>
            <p className="text-center text-sm text-[var(--text-on-dark-soft)]/70 mb-1">Área: {determinedArea.name}</p>
            <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-6">Pregunta {currentQuestionIndex + 1} de {questionsForStageTwo.length}.</p>
            <div className="text-center">
              <p className="text-lg md:text-xl text-[var(--text-on-dark)] mb-2">{currentStageTwoQuestion.text}</p>
              {currentStageTwoQuestion.reference && (
                <p className="text-xs text-[var(--golden-accent)]/80 mb-6">Referencia legal (informativa): {currentStageTwoQuestion.reference}</p>
              )}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                <Button 
                  onClick={() => handleAnswer(currentStageTwoQuestion.id, true)} 
                  variant="primary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Sí
                </Button>
                <Button 
                  onClick={() => handleAnswer(currentStageTwoQuestion.id, false)} 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  No
                </Button>
              </div>
              <div className="mt-10">
                <Button 
                  onClick={() => resetTestProgress(true)} 
                  variant="outline" 
                  size="sm"
                  iconName="arrow-left"
                  iconPosition="left"
                >
                  Reiniciar test (Etapa 1)
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // SERVICE OPTIONS (POST-DIAGNOSTIC) - Adapting to link to new service pages or specific actions
  // Fix: Check currentTestStage from state
  if (currentTestStage === TestStage.SERVICE_OPTIONS) {
    // Crear un resumen del test basado en el usuario actual y el área determinada
    const testResultSummary = {
        userName: currentUser?.name || "Usuario",
        determinedAreaName: determinedArea?.name || "No determinada"
    };

    // Obtener opciones de servicio específicas para mostrar después del diagnóstico
    // Filtrar las opciones relevantes de SERVICE_OPTIONS basadas en IDs o títulos
    const relevantServices = SERVICE_OPTIONS.filter(service => 
      ['lexia_premium_chat', 'auto_asistencia_lexia', 'reporte_estrategico'].includes(service.id) ||
      service.title.includes("Auto-Asistencia Legal") ||
      service.title.includes("Reporte Estratégico Híbrido")
    );

    return (
      <>
        <Layout>
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <section className="text-center mb-12 px-4">
              <Icon name="check-circle" size="xl" color="accent" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-[var(--sky-blue-light)] font-title mb-3">Diagnóstico Preliminar Completado</h2>
              <p className="text-lg text-[var(--text-on-dark-soft)]/80 max-w-2xl mx-auto">
                Gracias {testResultSummary.userName}. 
                {determinedArea && `Tu consulta parece estar relacionada principalmente con ${testResultSummary.determinedAreaName}.`}
              </p>
              <p className="text-md text-[var(--text-on-dark-soft)]/70 mt-2 max-w-2xl mx-auto">Este es un primer paso. Considera las siguientes opciones para profundizar:</p>
            </section>
        
        {/* Resumen del diagnóstico basado en las respuestas del usuario */}
        <Card className="max-w-2xl mx-auto mb-12 p-6 bg-[var(--surface-subtle)]/50 border border-[var(--border-subtle)]/30">
            <h3 className="text-xl font-semibold text-center text-[var(--text-on-dark)] font-title mb-3">Resumen del Diagnóstico</h3>
            <div className="text-sm text-[var(--coal)] space-y-4">
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
                    </p>
                </div>
            </div>
        </Card>

            {/* Servicios recomendados basados en el diagnóstico */}
            <div className="max-w-5xl mx-auto mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center text-[var(--sky-blue-light)] font-title">Servicios Recomendados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relevantServices.map((service) => (
                  <Card 
                    key={service.id} 
                    className="p-6 border border-[var(--border-subtle)]/30 hover:border-[var(--golden-accent)]/50 transition-all duration-300 flex flex-col h-full"
                    onClick={() => handleServiceOptionClick(service)}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--golden-accent)]/10 flex items-center justify-center mr-3">
                        <Icon name={'check'} size="md" color="accent" />
                      </div>
                      <h4 className="text-lg font-semibold text-[var(--sky-blue-light)] font-title">{service.title}</h4>
                    </div>
                    <p className="text-[var(--text-on-dark-soft)]/80 text-sm mb-4 flex-grow">{service.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-[var(--golden-accent)]">{service.priceCOP.toLocaleString('es-CO')} COP</span>
                      <Button variant="secondary" size="sm" iconName="arrow-right">Seleccionar</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
                <Button 
                  onClick={() => resetTestProgress(false)} 
                  variant="outline"
                  iconName="arrow-right"
                  iconPosition="left"
                >
                  Realizar Nuevo Diagnóstico
                </Button>
            </div>
          </div>
        </Layout>

        {/* Modal de pago que aparece cuando se selecciona un servicio */}
        {showPaymentModal && selectedServiceForPayment && (
          <Modal 
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            title={`Pago de Servicio: ${selectedServiceForPayment?.title || 'Servicio'}`}
            size="md"
            footer={
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
                <Button variant="primary" iconName="check" onClick={handlePaymentSuccessForLexia}>Confirmar Pago</Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="p-4 bg-[var(--surface-subtle)] rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-on-dark-soft)]">Servicio:</span>
                  <span className="font-medium">{selectedServiceForPayment?.title || 'No especificado'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-on-dark-soft)]">Precio:</span>
                  <span className="font-medium text-[var(--golden-accent)]">
                    {selectedServiceForPayment?.priceCOP ? 
                      `${selectedServiceForPayment.priceCOP.toLocaleString('es-CO')} COP` : 
                      'No especificado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-on-dark-soft)]">Tipo:</span>
                  <span className="font-medium">
                    {selectedServiceForPayment?.actionType ? 
                      selectedServiceForPayment.actionType.replace('_', ' ') : 
                      'No especificado'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-on-dark-soft)]/80">Al confirmar el pago, tendrás acceso inmediato al servicio seleccionado. Para este demo, no se procesará ningún pago real.</p>
            </div>
          </Modal>
        )}
        
        {/* Chat flotante de LexIA que aparece después del pago exitoso */}
        {showLexiaChat && currentLexiaContext && (
          <LexiaChatFloating
            lexiaContext={currentLexiaContext as LexiaContext}
            onClose={handleCloseChat}
          />
        )}
      </>
    );
  }

  // Si llegamos aquí, significa que ninguna de las condiciones anteriores se cumplió
  // Esto podría ocurrir durante la inicialización o en un estado no manejado
  
  // Si el componente está inicializado pero aún estamos en este punto, algo no está funcionando correctamente
  // Mostrar una interfaz que permita al usuario reiniciar el test o volver a la página principal
  if (isInitialized) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-[var(--sky-blue-light)] font-title title-case-es">Diagnóstico legal</h3>
            <p className="text-[var(--text-on-dark-soft)]/90 mb-6 sentence-case">Estamos experimentando un problema al cargar el test diagnóstico. Por favor, intenta una de las siguientes opciones:</p>
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
                iconName="arrow-right"
                iconPosition="left"
              >
                <span className="title-case-es">Reiniciar diagnóstico</span>
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full" iconName="arrow-right" iconPosition="left"><span className="title-case-es">Volver a la página principal</span></Button>
              </Link>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // Durante la inicialización inicial, mostrar un mensaje de carga
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="animate-spin text-[var(--golden-accent)]">
              <Icon name="cog" size="xl" />
            </div>
          </div>
          <p className="text-center text-lg text-[var(--text-on-dark-soft)]">Preparando el test diagnóstico...</p>
        </Card>
      </div>
    </Layout>
  );
};

export default DiagnosticoInicialPage;