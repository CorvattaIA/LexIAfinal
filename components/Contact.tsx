
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactFormData } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

const EnvelopeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.051-.992-.15-1.464l-.992-2.48a2.25 2.25 0 00-1.897-1.406L17.25 15m0 0c-.427 0-.844.04-1.254.116l-3.996 1.001c-.23.058-.477.084-.724.084a11.186 11.186 0 01-4.421-.992 11.186 11.186 0 01-4.027-3.086A11.186 11.186 0 012.75 7.25c0-.247.026-.494.084-.724l1.001-3.996A11.186 11.186 0 017.25 2.25c.427 0 .844-.04 1.254-.116L12.25 1.5m0 0A2.25 2.25 0 0114.5 3.75v1.372c0 .516.051.992.15 1.464l.992 2.48a2.25 2.25 0 01-1.897 1.406l-2.248.562M17.25 15a2.25 2.25 0 002.25-2.25V12A2.25 2.25 0 0017.25 9.75M15 9.75a2.25 2.25 0 012.25-2.25M15 9.75V15m0-5.25c-.427 0-.844.04-1.254.116L9.75 5.625m0 0A2.25 2.25 0 0112 3.375M9.75 5.625A2.25 2.25 0 007.5 3.375M9.75 5.625V15" />
    </svg>
);
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    dataPolicyAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.dataPolicyAccepted) {
        setFormError("Debes aceptar la política de tratamiento de datos para continuar.");
        return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log('Form data submitted:', formData);
    setSubmitMessage('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
    setFormData({ name: '', email: '', subject: '', message: '', dataPolicyAccepted: false });
    setIsSubmitting(false);
  };

  const inputBaseClasses = "mt-1 block w-full bg-[var(--deep-blue-dark)] border border-[var(--border-subtle)] rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--golden-accent)] sm:text-sm text-[var(--text-on-dark)] placeholder-[var(--text-on-dark-soft)]/60";

  return (
    <div className="py-12 md:py-16">
      <h2 className="text-4xl font-bold text-center mb-12 md:mb-16 font-title text-[var(--sky-blue-light)]">Ponte en Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-4">
        <Card className="p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-[var(--text-on-dark)] font-title">Envíanos un mensaje</h3>
          {submitMessage && <p className="mb-4 p-3 rounded-md bg-[var(--golden-accent)]/20 text-[var(--golden-accent)] border border-[var(--golden-accent)]/50 font-semibold text-sm">{submitMessage}</p>}
          {formError && <p className="mb-4 p-3 rounded-md bg-red-500/20 text-red-400 border border-red-500/50 font-semibold text-sm">{formError}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/80 font-title">Nombre completo</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required 
                     className={inputBaseClasses} placeholder="Tu nombre"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/80 font-title">Correo electrónico</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
                     className={inputBaseClasses} placeholder="tu@email.com"/>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/80 font-title">Asunto</label>
              <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required
                     className={inputBaseClasses} placeholder="Motivo de tu consulta"/>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--text-on-dark-soft)]/80 font-title">Mensaje</label>
              <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required
                        className={inputBaseClasses} placeholder="Describe brevemente tu situación..."></textarea>
            </div>
            <div className="flex items-start space-x-3">
              <input 
                id="dataPolicyAcceptedContact" 
                name="dataPolicyAccepted" 
                type="checkbox" 
                checked={formData.dataPolicyAccepted}
                onChange={handleChange}
                className="h-4 w-4 mt-0.5 text-[var(--golden-accent)] border-[var(--border-subtle)] rounded focus:ring-2 focus:ring-[var(--golden-accent)] bg-[var(--deep-blue-dark)] accent-[var(--golden-accent)]"
              />
              <label htmlFor="dataPolicyAcceptedContact" className="text-xs text-[var(--text-on-dark-soft)]/70">
                He leído y acepto la <Link to="/data-policy" className="underline text-[var(--sky-blue-light)] hover:text-[var(--golden-accent)]" target="_blank" rel="noopener noreferrer">Política de Tratamiento de Datos</Link> de Ciberabogados.
              </label>
            </div>
            <div>
              <Button type="submit" isLoading={isSubmitting} variant="primary" className="w-full text-base py-3" disabled={!formData.dataPolicyAccepted || isSubmitting}>
                Enviar mensaje
              </Button>
            </div>
          </form>
        </Card>
        
        <div className="space-y-8">
            <Card className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[var(--text-on-dark)] font-title">Información de contacto</h3>
                <ul className="space-y-4 text-[var(--text-on-dark-soft)]/90">
                    <li className="flex items-center">
                        <EnvelopeIcon className="w-6 h-6 mr-3 text-[var(--golden-accent)]"/>
                        ssolucionesdeia@gmail.com
                    </li>
                    <li className="flex items-center">
                        <PhoneIcon className="w-6 h-6 mr-3 text-[var(--golden-accent)]"/>
                        314-443-63-58 / 310-868-86-48
                    </li>
                    <li className="flex items-start">
                        <MapPinIcon className="w-6 h-6 mr-3 mt-1 text-[var(--golden-accent)] flex-shrink-0"/>
                        <span>Bogotá - Colombia</span>
                    </li>
                </ul>
            </Card>
            <Card className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[var(--text-on-dark)] font-title">Horario de atención</h3>
                <p className="text-[var(--text-on-dark-soft)]/90">Lunes a viernes: 9:00 AM - 6:00 PM</p>
                <p className="text-[var(--text-on-dark-soft)]/70 text-sm mt-1">(Cerrado fines de semana y festivos)</p>
            </Card>
             <div className="rounded-lg overflow-hidden shadow-xl border-2 border-[var(--border-subtle)]/30">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGVjaG5vbG9neSUyMGNpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=80" alt="Oficina moderna o ciudad tecnológica" className="w-full h-48 object-cover"/>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
