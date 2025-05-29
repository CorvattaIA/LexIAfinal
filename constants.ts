

import React from 'react';
import { LawArea, LawAreaId, StageOneQuestion, AssessmentQuestion, ServiceOption } from './types';

// --- ICON COMPONENTS (Simplified, color applied via className) ---
const IconHOC = (paths: React.ReactElement[]) => (svgProps: React.SVGProps<SVGSVGElement>) => (
  React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    ...svgProps
  }, ...paths)
);

// Fix: Export Icon
export const LaboralIcon = IconHOC([React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.58M14.25 18.72a3 3 0 01-3.741-5.58 9.094 9.094 0 013.741.479zM9.75 18.72a3 3 0 00-3.741-5.58 9.094 9.094 0 003.741.479zM4.5 18.72a3 3 0 01-3.741-5.58 9.094 9.094 0 013.741.479zM14.25 18.72L12 15.450M9.75 18.72L12 15.450M4.5 18.72L12 15.450m-7.5 0a3 3 0 003.741 2.73M12 3.75a3 3 0 013 3V9.75a3 3 0 01-3 3h-3a3 3 0 01-3-3V6.75a3 3 0 013-3zM12 3.75h.008v.015H12V3.75zm0 0h-.008v.015H12V3.75z", key:1 })]);
// Fix: Export Icon
export const PenalIcon = IconHOC([React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z", key:1 })]);
// Fix: Export Icon
export const FamiliaIcon = IconHOC([React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", key:1 })]);
// Fix: Export Icon
export const CivilIcon = IconHOC([React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", key:1 })]);
// Fix: Export Icon
export const MercantilIcon = IconHOC([React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6", key:1 })]);
// Fix: Export Icon
export const AdminIcon = IconHOC([React.createElement("path", {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z", key:1})]);
// Fix: Export Icon
export const CyberIcon = IconHOC([React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", key:1 })]);
export const AIEthicsIcon = IconHOC([
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", key: 1}), 
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 11.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3z M10.5 13.5h3", key: 2 }) 
]);
export const LexiaIcon = IconHOC([ 
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h11.25c1.035 0 2.07.422 2.804 1.156a3.217 3.217 0 010 4.536c-.734.734-1.77.156-2.804 1.156H3.75M18 16.5c.985 0 1.819-.673 2.074-1.586a2.588 2.588 0 00-.551-2.373C19.02 12.044 18 11.25 18 11.25S16.98 12.044 16.477 12.54c-.504.504-.625 1.288-.551 2.373A2.251 2.251 0 0018 16.5z", key:1 })
]);


// --- LAW AREAS ---
export const LAW_AREAS: LawArea[] = [
  { id: LawAreaId.LABORAL, name: 'Derecho Laboral', description: 'Conflictos laborales, contratos, despidos, prestaciones.', icon: LaboralIcon, isFullyImplemented: true },
  { id: LawAreaId.PENAL, name: 'Derecho Penal', description: 'Defensa en delitos, denuncias, procesos penales.', icon: PenalIcon, isFullyImplemented: true },
  { id: LawAreaId.FAMILIA, name: 'Derecho de Familia', description: 'Divorcios, custodia, alimentos, sucesiones.', icon: FamiliaIcon, isFullyImplemented: true },
  { id: LawAreaId.AI_ETHICS, name: 'Ética y Cumplimiento en IA', description: 'Regulación de IA, privacidad, sesgos algorítmicos, gobernanza.', icon: AIEthicsIcon, isFullyImplemented: true },
  { id: LawAreaId.CIVIL, name: 'Derecho Civil', description: 'Contratos, deudas, propiedad, responsabilidad civil.', icon: CivilIcon, isFullyImplemented: true },
  { id: LawAreaId.MERCANTIL, name: 'Derecho Comercial', description: 'Sociedades, títulos valores, competencia, insolvencia.', icon: MercantilIcon, isFullyImplemented: true },
  { id: LawAreaId.ADMINISTRATIVO, name: 'Derecho Administrativo', description: 'Conflictos con entidades públicas, contratación estatal.', icon: AdminIcon, isFullyImplemented: true },
  { id: LawAreaId.CYBER, name: 'Ciberseguridad y Delitos Informáticos', description: 'Estafas online, protección de datos, propiedad intelectual digital.', icon: CyberIcon, isFullyImplemented: true },
];

// --- STAGE ONE: CLASSIFICATION QUESTIONS ---
export const STAGE_ONE_QUESTIONS: StageOneQuestion[] = [
  { id: 's1q1', text: '¿Su consulta está principalmente relacionada con su trabajo, contrato laboral, despido o condiciones laborales?', mapsToArea: LawAreaId.LABORAL },
  { id: 's1q2', text: '¿Ha sido usted víctima de un delito, o está siendo investigado, acusado o necesita defensa en un proceso penal?', mapsToArea: LawAreaId.PENAL },
  { id: 's1q3', text: '¿Su situación involucra temas de matrimonio, divorcio, hijos (custodia, alimentos), herencias o violencia dentro del núcleo familiar?', mapsToArea: LawAreaId.FAMILIA },
  { id: 's1q4', text: '¿Está su consulta relacionada con la implementación, uso, o impacto de sistemas de inteligencia artificial en una corporación, incluyendo cumplimiento normativo, ética o privacidad de datos?', mapsToArea: LawAreaId.AI_ETHICS },
  { id: 's1q5', text: '¿El problema se refiere a un contrato general (no laboral, no comercial), una deuda, un bien inmueble (casa, apartamento), o una reclamación por daños y perjuicios contra otra persona o entidad privada?', mapsToArea: LawAreaId.CIVIL },
  { id: 's1q6', text: '¿Su consulta se relaciona con la creación o gestión de una empresa, sociedades, cheques, pagarés, o disputas comerciales entre empresas?', mapsToArea: LawAreaId.MERCANTIL },
];
export const STAGE_ONE_QUESTIONS_TARGET_COUNT = STAGE_ONE_QUESTIONS.length;


// --- STAGE TWO: SPECIFIC DIAGNOSTIC QUESTIONS ---
export const STAGE_TWO_QUESTIONS: Record<LawAreaId, AssessmentQuestion[]> = {
  [LawAreaId.LABORAL]: [
    { id: 'l1', text: '¿Su consulta está relacionada con un contrato laboral formal (escrito o verbal)?', reference: 'CST, Art. 37 y ss.' },
    { id: 'l2', text: '¿Ha habido una terminación de la relación laboral que considera sin justa causa?', reference: 'CST, Art. 64' },
    { id: 'l3', text: '¿Requiere revisión de su liquidación de prestaciones sociales (cesantías, intereses, prima, vacaciones)?', reference: 'CST, Art. 249 y ss.' },
    { id: 'l4', text: '¿Considera que sus derechos fundamentales en el trabajo (dignidad, igualdad, no discriminación) han sido vulnerados?', reference: 'Art. 25 CP, Jurisprudencia' },
    { id: 'l5', text: '¿Existen horas extras, recargos nocturnos, dominicales o festivos trabajados y no remunerados correctamente?', reference: 'CST, Art. 168' },
  ],
  [LawAreaId.PENAL]: [
    { id: 'p1', text: '¿Ha sido víctima de una conducta que considera un delito según el Código Penal colombiano?', reference: 'Ley 599 de 2000' },
    { id: 'p2', text: '¿Está usted (o alguien cercano) siendo investigado, ha sido citado a interrogatorio, o le han formulado imputación por algún delito?', reference: 'CPP, Art. 286 y ss.' },
    { id: 'p3', text: '¿Su consulta está relacionada con la solicitud, imposición o revocatoria de medidas de aseguramiento (detención preventiva, domiciliaria, etc.)?', reference: 'CPP, Art. 307 y ss.' },
    { id: 'p4', text: '¿Requiere información sobre mecanismos como el principio de oportunidad, preacuerdos, o mediación en materia penal?', reference: 'CPP, Art. 321, 348, 518' },
    { id: 'p5', text: '¿Necesita orientación sobre los derechos que le asisten como víctima dentro de un proceso penal (verdad, justicia, reparación)?', reference: 'CPP, Art. 11, Ley 906/2004' },
  ],
  [LawAreaId.FAMILIA]: [
    { id: 'f1', text: '¿Su consulta involucra trámites de divorcio o cesación de efectos civiles de matrimonio religioso?', reference: 'Ley 1ª/1976, Ley 25/1992, CGP' },
    { id: 'f2', text: '¿Existe una controversia o necesita definir la custodia, cuidado personal o el régimen de visitas de hijos menores de edad?', reference: 'Art. 44 CP, Ley 1098/2006' },
    { id: 'f3', text: '¿Requiere iniciar un proceso para establecer, aumentar, disminuir o exonerar una cuota alimentaria para hijos o cónyuge/compañero?', reference: 'CC, Art. 411 y ss., Ley 1098/2006' },
    { id: 'f4', text: '¿Necesita orientación sobre un proceso de sucesión por causa de muerte (testamento, herencia intestada)?', reference: 'CC, Art. 1008 y ss., CGP' },
    { id: 'f5', text: '¿Su consulta está relacionada con la declaración, existencia o disolución de una unión marital de hecho?', reference: 'Ley 54/1990, Ley 979/2005' },
  ],
  [LawAreaId.AI_ETHICS]: [
    { id: 'ae1', text: '¿Su organización está implementando o utilizando sistemas de IA que procesan datos personales?', reference: 'Ley 1581 de 2012 (Protección de Datos)' },
    { id: 'ae2', text: '¿Tiene inquietudes sobre posibles sesgos (de género, raza, etc.) en los algoritmos de IA utilizados o desarrollados por su empresa?', reference: 'Principios de IA Ética, Proyectos de Ley' },
    { id: 'ae3', text: '¿Requiere asesoría sobre la transparencia y explicabilidad de las decisiones tomadas por sistemas de IA en su corporación?', reference: 'Reglamento General de Protección de Datos (GDPR) si aplica, Futuras Regulaciones Colombianas' },
    { id: 'ae4', text: '¿Necesita establecer un marco de gobernanza interna para el desarrollo y despliegue ético y responsable de la IA?', reference: 'Guías OCDE IA, Marcos de Gobernanza de IA' },
    { id: 'ae5', text: '¿Su consulta se relaciona con la titularidad de la propiedad intelectual de obras creadas por IA o con el uso de material protegido por derechos de autor para entrenar modelos de IA?', reference: 'Ley 23 de 1982 (Derechos de Autor)' },
    { id: 'ae6', text: '¿Se han realizado evaluaciones de impacto ético y de derechos humanos antes de implementar soluciones de IA críticas?', reference: 'Estándares Internacionales, Recomendaciones de Expertos' },
    { id: 'ae7', text: '¿Existen mecanismos de auditoría y supervisión humana para los sistemas de IA implementados, especialmente aquellos con alto impacto?', reference: 'Mejores Prácticas en IA Responsable' },
  ],
  [LawAreaId.CIVIL]: [
    { id: 'civ1', text: '¿Su consulta está relacionada con un contrato civil (arrendamiento, compraventa, préstamo, etc.) que considera incumplido o que requiere revisión?', reference: 'CC, Art. 1495 y ss.' },
    { id: 'civ2', text: '¿Necesita asesoría sobre derechos reales (propiedad, posesión, servidumbres) o problemas con bienes inmuebles?', reference: 'CC, Art. 665, 669 y ss.' },
    { id: 'civ3', text: '¿Su consulta involucra una reclamación por daños y perjuicios (responsabilidad civil extracontractual)?', reference: 'CC, Art. 2341 y ss.' },
    { id: 'civ4', text: '¿Tiene problemas relacionados con obligaciones de pago, préstamos o deudas entre particulares?', reference: 'CC, Art. 1494 y ss.' },
    { id: 'civ5', text: '¿Requiere asesoría sobre procesos ejecutivos para el cobro de deudas respaldadas por títulos valores o documentos ejecutivos?', reference: 'CGP, Art. 422 y ss.' },
  ],
  [LawAreaId.MERCANTIL]: [
    { id: 'mer1', text: '¿Su consulta está relacionada con la constitución, modificación o disolución de sociedades comerciales?', reference: 'CCom, Art. 98 y ss., Ley 1258/2008' },
    { id: 'mer2', text: '¿Tiene inquietudes sobre contratos mercantiles (distribución, agencia comercial, franquicia, etc.)?', reference: 'CCom, Art. 864 y ss.' },
    { id: 'mer3', text: '¿Su consulta involucra títulos valores (cheques, pagarés, letras de cambio, facturas electrónicas)?', reference: 'CCom, Art. 619 y ss., Ley 1231/2008' },
    { id: 'mer4', text: '¿Necesita asesoría sobre propiedad industrial (marcas, patentes, diseños industriales, competencia desleal)?', reference: 'Decisión 486 CAN, Ley 256/1996' },
    { id: 'mer5', text: '¿Su consulta está relacionada con procedimientos concursales, insolvencia empresarial o reorganización?', reference: 'Ley 1116/2006' },
  ],
  [LawAreaId.ADMINISTRATIVO]: [
    { id: 'adm1', text: '¿Su consulta involucra una actuación, decisión o acto administrativo de una entidad pública que considera ilegal o que le afecta negativamente?', reference: 'CPACA, Art. 137 y ss.' },
    { id: 'adm2', text: '¿Necesita presentar derechos de petición, recursos o reclamaciones ante entidades públicas?', reference: 'CPACA, Art. 13-33, Ley 1755/2015' },
    { id: 'adm3', text: '¿Su consulta está relacionada con contratos estatales, licitaciones públicas o procesos de contratación con el Estado?', reference: 'Ley 80/1993, Ley 1150/2007' },
    { id: 'adm4', text: '¿Requiere asesoría sobre responsabilidad del Estado, reparación directa o demandas contra entidades públicas?', reference: 'CPACA, Art. 140, Constitución Art. 90' },
    { id: 'adm5', text: '¿Su consulta involucra temas de función pública, carrera administrativa o situaciones laborales con entidades estatales?', reference: 'Ley 909/2004' },
  ],
  [LawAreaId.CYBER]: [
    { id: 'cyb1', text: '¿Ha sido víctima de acceso abusivo a sistemas informáticos, interceptación de datos o violación de datos personales?', reference: 'Ley 1273/2009, Art. 269A-C' },
    { id: 'cyb2', text: '¿Su consulta está relacionada con daño informático, obstaculización de sistemas o suplantación de sitios web?', reference: 'Ley 1273/2009, Art. 269D-G' },
    { id: 'cyb3', text: '¿Ha sufrido hurto por medios informáticos, transferencias no consentidas de activos o software malicioso?', reference: 'Ley 1273/2009, Art. 269I-J' },
    { id: 'cyb4', text: '¿Necesita asesoría sobre protección de datos personales, habeas data o derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)?', reference: 'Ley 1581/2012, Decreto 1377/2013' },
    { id: 'cyb5', text: '¿Su consulta involucra comercio electrónico, firmas digitales o certificados digitales?', reference: 'Ley 527/1999' },
  ],
};

// --- SERVICE OPTIONS AFTER TEST (MCP MODEL) ---
export const SERVICE_OPTIONS: ServiceOption[] = [
  // Categoría: Diagnóstico Inicial
  {
    id: 'lexia_premium_chat',
    title: 'Consulta Premium con LexIA',
    description: 'Accede a un chat avanzado con LexIA, nuestra IA legal especializada. Ideal para una comprensión profunda post-test.',
    longDescription: 'LexIA utilizará el contexto de tu evaluación para profundizar en tu situación. Podrás hacer preguntas específicas y adjuntar imágenes de documentos. LexIA te proporcionará un diagnóstico jurídico, explorará dos rutas de acción (autogestión o asistencia profesional) y te dará una recomendación clara.',
    priceCOP: 45000,
    actionType: 'lexia_chat',
    features: ["Diagnóstico jurídico detallado", "Dos opciones estratégicas", "Fundamento legal y jurisprudencia", "Análisis de imágenes de documentos", "Recomendación de próximos pasos"],
  },
  // Categoría: Servicios Autogestionados IA
  {
    id: 'basic_legal_document_ai',
    title: 'Documentos Legales Básicos con IA',
    description: 'Genera borradores de documentos como derechos de petición o reclamaciones simples, adaptados por IA (rango 40.000 - 70.000 COP).',
    longDescription: 'Nuestra IA te guiará para generar documentos legales básicos, como derechos de petición, reclamaciones de baja complejidad, o cartas formales. El precio varía según la complejidad y personalización requerida.',
    priceCOP: 55000, // Precio promedio
    actionType: 'document_request', 
    features: ["Generación guiada por IA", "Adaptado a necesidades comunes", "Ahorro de tiempo", "Rango de precios flexible (40k-70k COP)"],
  },
  {
    id: 'automated_procedural_strategy_ai',
    title: 'Estrategia Procesal Automatizada con IA',
    description: 'Obtén un análisis de tu caso con IA, identificando posibles rutas procesales y consideraciones (rango 100.000 - 150.000 COP).',
    longDescription: 'Nuestra IA analiza la información de tu caso para ofrecerte un informe sobre posibles estrategias procesales, riesgos y fortalezas. Requiere información detallada y es ideal para planificar tus siguientes pasos.',
    priceCOP: 125000, // Precio promedio
    actionType: 'info', 
    features: ["Análisis predictivo IA", "Múltiples escenarios", "Identificación de riesgos y fortalezas", "Rango de precios (100k-150k COP)"],
  },
  {
    id: 'custom_contract_generation_ai',
    title: 'Generación de Contratos Personalizados con IA',
    description: 'Crea contratos a medida (ej. arrendamiento, prestación de servicios) con la asistencia de nuestra IA (rango 60.000 - 200.000 COP).',
    longDescription: 'Define las cláusulas y condiciones de tu contrato con la ayuda de LexIA. Ideal para contratos de uso común que requieren personalización. El precio varía según la complejidad del contrato.',
    priceCOP: 130000, // Precio promedio
    actionType: 'document_request',
    features: ["Cláusulas personalizables", "Guía paso a paso IA", "Adaptado a diversas necesidades", "Rango de precios (60k-200k COP)"],
  },
  // Categoría: Servicios Asistidos (IA + Abogado)
  {
    id: 'professional_document_review',
    title: 'Revisión de Documentos por Abogado',
    description: 'Un abogado experto revisará tus documentos legales y te proporcionará comentarios y recomendaciones (precio aprox. 90.000 COP).',
    longDescription: 'Sube tus documentos para que uno de nuestros abogados especializados los revise. Recibirás un informe con comentarios, posibles riesgos y sugerencias de mejora. El precio puede variar ligeramente según la extensión.',
    priceCOP: 90000,
    actionType: 'contact_form', 
    features: ["Revisión por experto legal", "Identificación de cláusulas críticas", "Recomendaciones de mejora", "Asegura tus intereses"],
  },
  {
    id: 'specialist_consultation_45min',
    title: 'Consulta de 45 min con Abogado Especialista',
    description: 'Agenda una consulta personalizada de 45 minutos con un abogado experto en tu área (rango 150.000 - 300.000 COP).',
    longDescription: 'Resuelve tus dudas complejas y define una estrategia legal directamente con un abogado. El precio varía según la especialidad y la urgencia del caso.',
    priceCOP: 225000, // Precio promedio
    actionType: 'contact_form', 
    features: ["Atención personalizada y directa", "Resolución de dudas complejas", "Estrategia legal a medida", "Confidencialidad garantizada"],
  },
  {
    id: 'full_legal_representation',
    title: 'Representación Legal Completa',
    description: 'Asistencia legal integral para tu caso, desde la preparación hasta la representación en instancias necesarias. Precio a convenir.',
    longDescription: 'Si tu caso requiere una gestión legal completa, incluyendo representación ante tribunales o entidades, te ofrecemos un servicio integral. El costo se define según la complejidad y duración del proceso.',
    priceCOP: 0, // Indica "Precio a convenir"
    actionType: 'contact_form',
    features: ["Representación integral", "Gestión completa del caso", "Abogados especializados", "Defensa de tus intereses"],
  },
];


export const FOOTER_TEXT = `© ${new Date().getFullYear()} Ciberabogados. Todos los derechos reservados. La información y las consultas con IA no constituyen asesoramiento legal definitivo ni establecen una relación abogado-cliente formal. Consulta siempre con un profesional para decisiones legales importantes.`;
export const ESTIMATED_TIME_STAGE_1 = "Aprox. 1-2 minutos";
export const ESTIMATED_TIME_STAGE_2 = "Aprox. 3-5 minutos";
export const RESULTS_SIMULATION_TEXT = "Analizando tus respuestas y generando un resumen preliminar...";

export const SUPABASE_URL = process.env.SUPABASE_URL || (globalThis.window as any)?.SUPABASE_URL || 'YOUR_SUPABASE_URL_ENV_VAR_NOT_SET';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || (globalThis.window as any)?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_ENV_VAR_NOT_SET';
