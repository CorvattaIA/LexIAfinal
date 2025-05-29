
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { ServiceOption, PaymentStatus } from '../types';
import { LexiaIcon } from '../constants';

// Placeholder for payment gateway icons
const WompiIcon = () => <span className="font-bold text-purple-400">Wompi</span>; // Keep as is or use actual SVG
const MercadoPagoIcon = () => <span className="font-bold text-sky-400">MercadoPago</span>; // Keep as is or use actual SVG

// Fix: Define PaymentModalProps interface
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  service: ServiceOption | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, service }) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [selectedGateway, setSelectedGateway] = useState<'wompi' | 'mercadopago' | null>(null);

  const handlePayment = async () => {
    if (!selectedGateway) {
        alert("Por favor, selecciona un método de pago.");
        return;
    }
    setPaymentStatus(PaymentStatus.PROCESSING);
    await new Promise(resolve => setTimeout(resolve, 2500)); 
    const isSuccess = true; 

    if (isSuccess) {
      setPaymentStatus(PaymentStatus.SUCCESS);
      setTimeout(() => {
        onPaymentSuccess();
        onClose(); 
        setPaymentStatus(PaymentStatus.IDLE); 
        setSelectedGateway(null);
      }, 1500); 
    } else {
      setPaymentStatus(PaymentStatus.FAILED);
       setTimeout(() => { 
        setPaymentStatus(PaymentStatus.IDLE);
        setSelectedGateway(null);
      }, 3000);
    }
  };

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Compra" size="md">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--deep-blue-dark)] mb-3 border-2 border-[var(--golden-accent)]">
            <LexiaIcon className="w-8 h-8 text-[var(--golden-accent)]" />
          </div>
          <h4 className="text-xl font-semibold text-[var(--text-on-dark)] font-title">{service.title}</h4>
          <p className="text-3xl font-bold text-[var(--golden-accent)] mt-2">
            {service.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-[var(--text-on-dark-soft)]/70 mt-1">Sesión única de consultoría avanzada con IA.</p>
        </div>

        {paymentStatus === PaymentStatus.IDLE && (
            <>
            <p className="text-sm text-center text-[var(--text-on-dark-soft)]/80">Selecciona tu método de pago preferido:</p>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setSelectedGateway('wompi')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all
                                ${selectedGateway === 'wompi' ? 'border-[var(--golden-accent)] bg-[var(--golden-accent)]/10' : 'border-[var(--border-subtle)]/50 hover:border-[var(--golden-accent)]/70'}`}
                >
                    <WompiIcon />
                    <span className={`mt-1 text-xs ${selectedGateway === 'wompi' ? 'text-[var(--golden-accent)]' : 'text-[var(--text-on-dark-soft)]/80'}`}>Pagar con Wompi</span>
                </button>
                <button 
                    onClick={() => setSelectedGateway('mercadopago')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all
                                ${selectedGateway === 'mercadopago' ? 'border-[var(--golden-accent)] bg-[var(--golden-accent)]/10' : 'border-[var(--border-subtle)]/50 hover:border-[var(--golden-accent)]/70'}`}
                >
                    <MercadoPagoIcon />
                    <span className={`mt-1 text-xs ${selectedGateway === 'mercadopago' ? 'text-[var(--golden-accent)]' : 'text-[var(--text-on-dark-soft)]/80'}`}>Pagar con MercadoPago</span>
                </button>
            </div>
            <Button 
                onClick={handlePayment} 
                variant="primary" 
                className="w-full py-3 text-base"
                disabled={!selectedGateway}
            >
                Pagar {service.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            </Button>
            </>
        )}

        {paymentStatus === PaymentStatus.PROCESSING && (
          <div className="text-center py-8">
            <svg className="animate-spin h-12 w-12 text-[var(--golden-accent)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-[var(--text-on-dark-soft)]">Procesando pago...</p>
            <p className="text-sm text-[var(--text-on-dark-soft)]/70">Esto puede tardar unos segundos. No cierres esta ventana.</p>
          </div>
        )}

        {paymentStatus === PaymentStatus.SUCCESS && (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-lg font-semibold text-green-400">¡Pago exitoso!</p>
            <p className="text-sm text-[var(--text-on-dark-soft)]/80">Redirigiendo a tu sesión con LexIA...</p>
          </div>
        )}

        {paymentStatus === PaymentStatus.FAILED && (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-lg font-semibold text-red-400">Pago fallido</p>
            <p className="text-sm text-[var(--text-on-dark-soft)]/80 mb-4">Lo sentimos, no se pudo procesar tu pago. Por favor, intenta con otro método o verifica tus datos.</p>
            <Button onClick={() => {setPaymentStatus(PaymentStatus.IDLE); setSelectedGateway(null);}} variant="secondary">Intentar de nuevo</Button>
          </div>
        )}

        <p className="text-xs text-center text-[var(--text-on-dark-soft)]/60">
          Transacción segura simulada. En un entorno real, serías redirigido a la pasarela de pago.
        </p>
      </div>
    </Modal>
  );
};

export default PaymentModal;
