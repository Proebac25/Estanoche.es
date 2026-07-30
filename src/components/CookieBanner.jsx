import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCookieBite } from 'react-icons/fa';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya se tomó una decisión de consentimiento
    const consent = localStorage.getItem('cookieConsent');
    
    if (consent === 'accepted') {
      // Si ya aceptó, actualizar gtag para activar seguimiento en esta sesión
      updateConsent(true);
    } else if (!consent) {
      // Si no ha decidido, montar el componente y mostrar tras un breve delay (entrada suave)
      setMounted(true);
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateConsent = (granted) => {
    if (typeof window.gtag === 'function') {
      const consentState = granted ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        'ad_storage': consentState,
        'analytics_storage': consentState,
        'ad_user_data': consentState,
        'ad_personalization': consentState
      });
      console.log(`[CookieConsent] Consent status updated to: ${consentState}`);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    updateConsent(true);
    setVisible(false);
    setTimeout(() => setMounted(false), 500); // Dar tiempo para la animación de salida
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    updateConsent(false);
    setVisible(false);
    setTimeout(() => setMounted(false), 500); // Dar tiempo para la animación de salida
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999] transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/80 dark:bg-[#1E293B]/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/80 rounded-mo-lg shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] p-5 flex flex-col gap-4 font-ui">
        <div className="flex gap-3 items-start">
          <div className="p-2.5 bg-mo-sage/10 text-mo-olive rounded-lg flex-shrink-0">
            <FaCookieBite className="text-xl animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-mo-text dark:text-white mb-1">
              Valoramos tu privacidad
            </h4>
            <p className="text-xs text-mo-muted dark:text-gray-400 leading-relaxed">
              Utilizamos cookies propias y de terceros para analizar el tráfico de nuestro sitio web y personalizar el contenido. Puedes aceptar todas las cookies o rechazar su uso. Consulta nuestra{' '}
              <Link to="/legal/cookies" className="text-mo-olive hover:underline font-semibold">
                Política de Cookies
              </Link>{' '}
              para más información.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800/60 pt-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-semibold text-mo-muted hover:text-mo-text dark:hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-mo-primary rounded-mo shadow-mo-soft hover:opacity-95 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
