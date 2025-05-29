
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  LAW_AREAS, 
  STAGE_ONE_QUESTIONS, 
  STAGE_TWO_QUESTIONS,
  SERVICE_OPTIONS,
  ESTIMATED_TIME_STAGE_1,
  ESTIMATED_TIME_STAGE_2,
  RESULTS_SIMULATION_TEXT,
} from '../constants';
import { 
  LawArea, LawAreaId, AssessmentQuestion, Answer, 
  TestStage, UserRegistrationData, RegisteredUser, ServiceOption, StageOneQuestion,
  LexiaContext, TestResultSummary, UserRegistrationSchema
} from '../types';
import { saveUserRegistration } from '../services/supabaseService';
import Button from './ui/Button';
import Card from './ui/Card';
import PaymentModal from './PaymentModal'; 

// --- Helper Icons ---
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

interface AssessmentTestProps {
  currentUser: RegisteredUser | null;
  setCurrentUser: (user: RegisteredUser | null) => void;
}

const AssessmentTest: React.FC<AssessmentTestProps> = ({ currentUser, setCurrentUser }) => {
  const [currentTestStage, setCurrentTestStage] = useState<TestStage>(TestStage.REGISTRATION);
  const [determinedArea, setDeterminedArea] = useState<LawArea | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [stageOneAnswers, setStageOneAnswers] = useState<Answer[]>([]);
  const [stageTwoAnswers, setStageTwoAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null); 
  
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<ServiceOption | null>(null);
  const [currentLexiaContext, setCurrentLexiaContext] = useState<LexiaContext | null>(null);

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
    defaultValues: {
      name: '',
      email: '',
      interestedAreaId: undefined,
      dataPolicyAccepted: false,
    }
  });

  const dataPolicyAcceptedWatcher = watch("dataPolicyAccepted");

  useEffect(() => {
    if (currentUser) {
      setCurrentTestStage(TestStage.STAGE_ONE);
    } else {
      setCurrentTestStage(TestStage.REGISTRATION);
      resetRegistrationForm(); 
    }
  }, [currentUser, resetRegistrationForm]);


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

  const processStageOneAnswers = (currentAnswers: Answer[]) => {
    let primaryAreaId: LawAreaId | undefined;
    const lastYesAnswer = [...currentAnswers].reverse().find(ans => ans.value === true);
    if (lastYesAnswer) {
        const question = STAGE_ONE_QUESTIONS.find(q => q.id === lastYesAnswer.questionId);
        if (question?.mapsToArea && !Array.isArray(question.mapsToArea)) {
            primaryAreaId = question.mapsToArea;
        }
    }
    const foundArea = LAW_AREAS.find(area => area.id === primaryAreaId) || LAW_AREAS.find(area => area.isFullyImplemented) || LAW_AREAS[0]; // Fallback logic
    setDeterminedArea(foundArea); 
    setCurrentQuestionIndex(0); 
    setStageTwoAnswers([]); 
    setCurrentTestStage(TestStage.STAGE_TWO);
  };


  const handleAnswer = (questionId: string, value: boolean | string) => {
    if (currentTestStage === TestStage.STAGE_ONE) {
      const newAnswers = [...stageOneAnswers, { questionId, value }];
      setStageOneAnswers(newAnswers);
      if (currentQuestionIndex < STAGE_ONE_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        processStageOneAnswers(newAnswers);
      }
    } else if (currentTestStage === TestStage.STAGE_TWO && determinedArea) {
      const newAnswers = [...stageTwoAnswers, { questionId, value }];
      setStageTwoAnswers(newAnswers);
      const areaQuestions = STAGE_TWO_QUESTIONS[determinedArea.id] || [];
      if (currentQuestionIndex < areaQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentTestStage(TestStage.RESULTS_SIMULATION);
        setTimeout(() => setCurrentTestStage(TestStage.SERVICE_OPTIONS), 2500);
      }
    }
  };
  
  const handleServiceOptionClick = (option: ServiceOption) => {
    if (option.actionType === 'lexia_chat' && determinedArea) {
      const summaryParts: string[] = [];
      stageOneAnswers.forEach(ans => {
        const q = STAGE_ONE_QUESTIONS.find(q => q.id === ans.questionId);
        if(q && ans.value === true && q.mapsToArea) summaryParts.push(`Indicó sí a: "${q.text}" (relacionado a ${LAW_AREAS.find(a => a.id === q.mapsToArea)?.name})`);
      });
      stageTwoAnswers.forEach(ans => {
        const q = STAGE_TWO_QUESTIONS[determinedArea.id]?.find(q => q.id === ans.questionId);
        if(q && ans.value === true) summaryParts.push(`En ${determinedArea.name}, indicó sí a: "${q.text}"`);
      });

      const testAnswersSummary = summaryParts.length > 0 ? summaryParts.join('. ') : "No se proporcionaron detalles específicos en el test.";

      const lexiaCtx: LexiaContext = {
        determinedArea: determinedArea,
        testAnswersSummary: testAnswersSummary,
        userName: currentUser?.name || "Usuario"
      };
      setCurrentLexiaContext(lexiaCtx);
      setSelectedServiceForPayment(option);
      setShowPaymentModal(true);
    } else if (option.actionType === 'contact_form') {
      navigate(`/contact?service=${encodeURIComponent(option.title)}`);
    } else if (option.actionType === 'document_request' && determinedArea){
        navigate(`/contact?service=${encodeURIComponent(option.title)}&area=${determinedArea.id}`);
    } else {
        navigate(`/services`); // Default to services page for info
    }
  };

  const handlePaymentSuccessForLexia = () => {
    if (currentLexiaContext) {
      navigate('/lexia-chat', { state: { lexiaContext: currentLexiaContext } });
    }
    setShowPaymentModal(false); 
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
    setCurrentQuestionIndex(0);
    setStageOneAnswers([]);
    setStageTwoAnswers([]);
    setSubmitError(null);
    setShowPaymentModal(false);
    setSelectedServiceForPayment(null);
    setCurrentLexiaContext(null);
  };

  const renderProgressBar = () => {
    let totalQuestions = 0;
    let currentProgress = 0;
    let estimatedTime = "";

    if (currentTestStage === TestStage.STAGE_ONE) {
      totalQuestions = STAGE_ONE_QUESTIONS.length;
      currentProgress = currentQuestionIndex;
      estimatedTime = ESTIMATED_TIME_STAGE_1;
    } else if (currentTestStage === TestStage.STAGE_TWO && determinedArea && determinedArea.isFullyImplemented) {
      totalQuestions = (STAGE_TWO_QUESTIONS[determinedArea.id] || []).length;
      currentProgress = currentQuestionIndex;
      estimatedTime = ESTIMATED_TIME_STAGE_2;
    } else {
      return null;
    }
    if (totalQuestions === 0) return null;

    const progressPercentage = (currentProgress / totalQuestions) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-[var(--golden-accent)]">Progreso</span>
          <span className="text-sm font-medium text-[var(--text-on-dark-soft)]/70">{estimatedTime}</span>
        </div>
        <div className="w-full bg-[var(--deep-blue-dark)] rounded-full h-2.5 border border-[var(--border-subtle)]/50">
          <div 
            className="bg-[var(--golden-accent)] h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  const inputBaseClasses = `block w-full bg-[var(--deep-blue-dark)] border border-[var(--border-subtle)] rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--golden-accent)] sm:text-sm text-[var(--text-on-dark)] placeholder-[var(--text-on-dark-soft)]/60`;
  const inputErrorClasses = `border-red-500 focus:ring-red-500`;
  const inputValidClasses = `border-[var(--border-subtle)] focus:ring-[var(--golden-accent)]`;


  if (currentTestStage === TestStage.REGISTRATION) {
    return (
      <Card className="max-w-lg mx-auto mt-10 p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-3 font-title text-[var(--sky-blue-light)]">Bienvenido a Ciberabogados</h2>
        <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-8">
          Realiza nuestro test diagnóstico gratuito para una primera orientación. Por favor, regístrate para comenzar.
        </p>
        <form onSubmit={handleSubmit(onRegistrationSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Nombre completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-[var(--text-on-dark-soft)]/50" />
              </div>
              <input type="text" id="name" {...register("name")}
                     className={`${inputBaseClasses} pl-10 ${errors.name ? inputErrorClasses : inputValidClasses}`} 
                     placeholder="Tu nombre"/>
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Correo electrónico</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-[var(--text-on-dark-soft)]/50" />
                </div>
                <input type="email" id="email" {...register("email")}
                        className={`${inputBaseClasses} pl-10 ${errors.email ? inputErrorClasses : inputValidClasses}`} 
                        placeholder="tu@email.com"/>
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="interestedAreaId" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/90 font-title mb-1">Área de interés inicial</label>
            <select id="interestedAreaId" {...register("interestedAreaId")}
                    className={`${inputBaseClasses} ${errors.interestedAreaId ? inputErrorClasses : inputValidClasses}`}>
                <option value="" className="text-[var(--text-on-dark-soft)]/70">Selecciona un área...</option>
                {LAW_AREAS.map(area => (
                    <option key={area.id} value={area.id} className="bg-[var(--deep-blue-dark)] text-[var(--text-on-dark)]">{area.name}</option>
                ))}
            </select>
            {errors.interestedAreaId && <p className="mt-1 text-xs text-red-400">{errors.interestedAreaId.message}</p>}
          </div>

          <div className="flex items-start space-x-3">
            <input 
              id="dataPolicyAccepted" 
              type="checkbox" 
              {...register("dataPolicyAccepted")}
              className="h-4 w-4 mt-0.5 text-[var(--golden-accent)] border-[var(--border-subtle)] rounded focus:ring-2 focus:ring-[var(--golden-accent)] bg-[var(--deep-blue-dark)] accent-[var(--golden-accent)]"
            />
            <label htmlFor="dataPolicyAccepted" className="text-xs text-[var(--text-on-dark-soft)]/70">
              He leído y acepto la <Link to="/data-policy" className="underline text-[var(--sky-blue-light)] hover:text-[var(--golden-accent)]" target="_blank" rel="noopener noreferrer">Política de Tratamiento de Datos</Link> de Ciberabogados.
            </label>
          </div>
          {errors.dataPolicyAccepted && <p className="mt-1 text-xs text-red-400">{errors.dataPolicyAccepted.message}</p>}
          
          {submitError && <p className="text-sm text-red-400 text-center">{submitError}</p>}
          <Button 
            type="submit" 
            isLoading={isLoading} 
            variant="primary" 
            className="w-full py-3 text-base"
            disabled={!isRegistrationFormValid || isLoading || !dataPolicyAcceptedWatcher}
          >
            Registrarse e iniciar test gratuito
          </Button>
        </form>
      </Card>
    );
  }

  const questionsForStageOne = STAGE_ONE_QUESTIONS;
  const currentStageOneQuestion: StageOneQuestion | undefined = questionsForStageOne[currentQuestionIndex];
  
  const questionsForStageTwo = determinedArea ? (STAGE_TWO_QUESTIONS[determinedArea.id] || []) : [];
  const currentStageTwoQuestion: AssessmentQuestion | undefined = questionsForStageTwo[currentQuestionIndex];

  if (currentTestStage === TestStage.STAGE_ONE && currentStageOneQuestion) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 p-8 md:p-10">
        {renderProgressBar()}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 font-title text-[var(--sky-blue-light)]">Test Gratuito - Etapa 1: Clasificación</h2>
        <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-8">
          Pregunta {currentQuestionIndex + 1} de {questionsForStageOne.length}. Responde para identificar el área principal de tu consulta.
        </p>
        <div className="text-center">
          <p className="text-lg md:text-xl text-[var(--text-on-dark)] mb-2">{currentStageOneQuestion.text}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <Button onClick={() => handleAnswer(currentStageOneQuestion.id, true)} variant="primary" size="lg" className="w-full sm:w-auto">
              Sí
            </Button>
            <Button onClick={() => handleAnswer(currentStageOneQuestion.id, false)} variant="secondary" size="lg" className="w-full sm:w-auto">
              No
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  if (currentTestStage === TestStage.STAGE_TWO && determinedArea) {
    if (!determinedArea.isFullyImplemented || !currentStageTwoQuestion) {
       return (
        <Card className="max-w-xl mx-auto mt-10 p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 font-title text-[var(--sky-blue-light)]">Área: {determinedArea.name}</h3>
            <p className="text-[var(--text-on-dark-soft)]/90 mb-6">
                Las preguntas específicas para el área de {determinedArea.name} están siendo desarrolladas o esta área no requiere diagnóstico detallado en el test gratuito.
                Puedes proceder a ver nuestras opciones de servicio.
            </p>
            <div className="space-y-3">
                <Button onClick={() => { setCurrentTestStage(TestStage.RESULTS_SIMULATION); setTimeout(() => setCurrentTestStage(TestStage.SERVICE_OPTIONS), 1000);}} variant="primary">
                    Ver opciones de servicio
                </Button>
                <Button onClick={() => resetTestProgress(true)} variant="secondary">
                    Volver a clasificación (Etapa 1)
                </Button>
            </div>
        </Card>
       );
    }
    return (
      <Card className="max-w-2xl mx-auto mt-10 p-8 md:p-10">
        {renderProgressBar()}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-1 font-title text-[var(--sky-blue-light)]">Test Gratuito - Etapa 2: Diagnóstico</h2>
        <p className="text-center text-sm text-[var(--text-on-dark-soft)]/70 mb-1">Área: {determinedArea.name}</p>
        <p className="text-center text-[var(--text-on-dark-soft)]/80 mb-6">
          Pregunta {currentQuestionIndex + 1} de {questionsForStageTwo.length}.
        </p>
        <div className="text-center">
          <p className="text-lg md:text-xl text-[var(--text-on-dark)] mb-2">{currentStageTwoQuestion.text}</p>
          {currentStageTwoQuestion.reference && (
            <p className="text-xs text-[var(--golden-accent)]/80 mb-6">Referencia legal (informativa): {currentStageTwoQuestion.reference}</p>
          )}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <Button onClick={() => handleAnswer(currentStageTwoQuestion.id, true)} variant="primary" size="lg" className="w-full sm:w-auto">
              Sí
            </Button>
            <Button onClick={() => handleAnswer(currentStageTwoQuestion.id, false)} variant="secondary" size="lg" className="w-full sm:w-auto">
              No
            </Button>
          </div>
           <div className="mt-10">
                <Button onClick={() => resetTestProgress(true)} variant="outline" size="sm">
                    Reiniciar test (Etapa 1)
                </Button>
            </div>
        </div>
      </Card>
    );
  }

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
  
  if (currentTestStage === TestStage.SERVICE_OPTIONS) {
    const resultSummary: TestResultSummary = {
        userName: currentUser?.name || "Usuario",
        determinedAreaName: determinedArea?.name || "No determinada"
    };
    return (
      <div className="py-8">
        <div className="text-center mb-12 px-4">
            <CheckCircleIcon className="w-16 h-16 text-[var(--golden-accent)] mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-[var(--sky-blue-light)] font-title mb-3">Test Gratuito Completado</h2>
            <p className="text-lg text-[var(--text-on-dark-soft)]/80 max-w-2xl mx-auto">
                Gracias {resultSummary.userName}. Hemos procesado tus respuestas. 
                {determinedArea && ` Tu consulta parece estar relacionada principalmente con ${resultSummary.determinedAreaName}.`}
            </p>
            <p className="text-md text-[var(--text-on-dark-soft)]/70 mt-2 max-w-2xl mx-auto">
                A continuación, te presentamos algunas opciones de servicio para profundizar y obtener asesoría experta:
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 max-w-5xl mx-auto px-4">
          {SERVICE_OPTIONS.map((option) => (
            <Card key={option.id} className="flex flex-col text-left p-6 border hover:border-[var(--golden-accent)] h-full"> {/* Ensure h-full for flex to work */}
              <h3 className="text-xl font-semibold text-[var(--golden-accent)] mb-2 font-title">{option.title}</h3>
              <p className="text-lg font-semibold text-[var(--text-on-dark)] mb-3">{option.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits:0 })}</p>
              <p className="text-sm text-[var(--text-on-dark-soft)]/80 mb-4 flex-grow">{option.longDescription || option.description}</p>
              {option.features && option.features.length > 0 && (
                <ul className="text-xs text-[var(--text-on-dark-soft)]/70 space-y-1.5 mb-4">
                    {option.features.map(feature => (
                        <li key={feature} className="flex items-center">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-[var(--golden-accent)]/70 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>
              )}
              <div className="mt-auto"> {/* Push button to bottom */}
                <Button onClick={() => handleServiceOptionClick(option)} variant={option.actionType === 'lexia_chat' ? "primary" : "secondary"} className="w-full py-2.5">
                  {option.actionType === 'lexia_chat' ? "Consultar con LexIA ahora" : 
                   (option.priceCOP === 0 ? "Solicitar cotización" : "Más información / solicitar")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button onClick={() => resetTestProgress(false)} variant="outline">Realizar nuevo test (desde el inicio)</Button>
        </div>
        {showPaymentModal && selectedServiceForPayment && (
          <PaymentModal 
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={handlePaymentSuccessForLexia}
            service={selectedServiceForPayment}
          />
        )}
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <p className="text-center text-lg text-[var(--text-on-dark-soft)]">Cargando evaluación...</p>
    </Card>
  );
};

export default AssessmentTest;
