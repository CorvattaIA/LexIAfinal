
import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';

const DataPolicyPage: React.FC = () => {
  return (
    <div className="py-12 md:py-16 max-w-3xl mx-auto px-4">
      <Card className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 font-title text-[var(--sky-blue-light)]">Política de Tratamiento de Datos Personales</h1>
        
        <p className="mb-6 text-sm text-[var(--text-on-dark-soft)]/90">Fecha de última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">1. Responsable del Tratamiento</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Ciberabogados (en adelante, "la Firma"), con correo electrónico de contacto <a href="mailto:ssolucionesdeia@gmail.com" className="underline hover:text-[var(--golden-accent)] transition-colors">ssolucionesdeia@gmail.com</a> y operando desde Bogotá, Colombia, es responsable del tratamiento de los datos personales recolectados a través de su sitio web.
          </p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">2. Datos Personales Recolectados</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 mb-2 leading-relaxed">La Firma podrá recolectar los siguientes datos personales:</p>
          <ul className="list-disc list-inside text-sm text-[var(--text-on-dark-soft)]/85 space-y-1.5 pl-4 leading-relaxed">
            <li><strong>Datos de identificación:</strong> nombre completo, correo electrónico.</li>
            <li><strong>Información de contacto:</strong> número de teléfono (si se proporciona).</li>
            <li><strong>Información de caso:</strong> área legal de interés, respuestas en el test diagnóstico, mensajes e imágenes (si se adjuntan) en chats (Asistencia General y LexIA).</li>
            <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, etc. (recolección estándar para funcionamiento y seguridad).</li>
          </ul>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">3. Finalidad del Tratamiento</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 mb-2 leading-relaxed">Los datos personales recolectados serán utilizados para:</p>
          <ul className="list-disc list-inside text-sm text-[var(--text-on-dark-soft)]/85 space-y-1.5 pl-4 leading-relaxed">
            <li>Proveer los servicios del sitio web (test, chats de IA).</li>
            <li>Gestionar el registro de usuarios.</li>
            <li>Responder a consultas y peticiones.</li>
            <li>Personalizar y mejorar la experiencia del usuario.</li>
            <li>Realizar análisis estadísticos anónimos para mejora de servicios.</li>
            <li>Cumplir con obligaciones legales.</li>
          </ul>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">4. Base Legal para el Tratamiento</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            El tratamiento se basa en su consentimiento explícito (otorgado al aceptar esta política) y en la necesidad de ejecutar los servicios solicitados.
          </p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">5. Almacenamiento y Seguridad</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Los datos de registro se almacenan en Supabase. Las interacciones con IA (Gemini API) se procesan a través de dicha API; Ciberabogados no almacena permanentemente las conversaciones completas. Las imágenes en LexIA se envían a Gemini API para análisis y no se almacenan permanentemente por Ciberabogados. Implementamos medidas para proteger sus datos.
          </p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">6. Derechos del Titular</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 mb-2 leading-relaxed">Usted tiene derecho a conocer, actualizar, rectificar, solicitar prueba de autorización, ser informado del uso, presentar quejas, revocar autorización y/o solicitar supresión de sus datos, y acceder gratuitamente a ellos. Para ejercerlos, contáctenos en <a href="mailto:ssolucionesdeia@gmail.com" className="underline hover:text-[var(--golden-accent)] transition-colors">ssolucionesdeia@gmail.com</a>.</p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">7. Transferencia y Transmisión</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Sus datos pueden ser procesados por proveedores como Supabase y Google (Gemini API) bajo acuerdos de protección. No vendemos ni compartimos sus datos para marketing sin su consentimiento.
          </p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">8. Duración del Tratamiento</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Sus datos se conservarán el tiempo necesario para las finalidades recolectadas, o hasta que solicite su supresión, salvo obligación legal.
          </p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">9. Política de Cookies</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Actualmente, no utilizamos cookies de seguimiento extensivas. Si esto cambia, actualizaremos esta política.
          </p>
        </section>

        <section className="mb-6 policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">10. Modificaciones</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Nos reservamos el derecho de modificar esta política. Cambios serán informados en nuestro sitio web.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="text-xl font-semibold text-[var(--golden-accent)] mb-3 font-title">11. Consentimiento</h2>
          <p className="text-sm text-[var(--text-on-dark-soft)]/85 leading-relaxed">
            Al usar nuestros servicios, declara haber leído, entendido y aceptado esta Política de Tratamiento de Datos Personales.
          </p>
        </section>
        <div className="mt-10 text-center">
            <Link to="/contact">
                <Button variant="outline">Contactar sobre esta política</Button>
            </Link>
        </div>
      </Card>
    </div>
  );
};

export default DataPolicyPage;
