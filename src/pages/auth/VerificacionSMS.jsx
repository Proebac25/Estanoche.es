import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaMobileAlt, FaArrowLeft } from 'react-icons/fa';
import { getMasterCode } from '../../utils/security';

const VerificacionSMS = () => {
  const { theme } = useTheme();
  const { user, upgradeToPromoter } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Estados
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [telefono, setTelefono] = useState('');

  const isUpgradeMode = location.state?.upgrade || false;

  const colors = {
    primary: '#FF6B6B', // Rojo Coral para Promotores
    success: '#10B981',
    error: '#DC2626'
  };

  useEffect(() => {
    if (location.state?.telefono) {
      setTelefono(location.state.telefono);
    } else if (user?.telefono) {
      setTelefono(user.telefono);
    }
  }, [location.state, user]);

  const handleVerify = async () => {
    const codeStr = codigo.join('');

    // --- LÓGICA CÓDIGO MAESTRO ---
    const MASTER_CODE = getMasterCode();
    console.log('🔐 Código Maestro de hoy:', MASTER_CODE); // Para debug/admin
    // -----------------------------

    if (codeStr !== MASTER_CODE && codeStr.length !== 6) {
      setError('Introduce el código correcto');
      return;
    }
    // -----------------------------

    setIsSubmitting(true);
    setError('');

    try {
      // Si es el código maestro, omitimos validación real
      if (codeStr === MASTER_CODE) {
        console.log('🔓 Acceso mediante Código Maestro');
        setSuccess('¡Código maestro aceptado!');
      } else {
        // Simulación de verificación SMS
        console.log('🔐 Verificando código SMS:', codeStr);
        setSuccess('¡Móvil verificado correctamente!');
      }

      // PASO CRÍTICO: Upgrade a Promotor
      const result = await upgradeToPromoter(user.id);

      if (result.success) {
        setTimeout(() => navigate('/RegistroPromotor'), 1500);
      } else {
        setError('Error al activar estatus de promotor: ' + result.error);
        setIsSubmitting(false);
      }

    } catch (err) {
      setError('Error al verificar el código.');
      setIsSubmitting(false);
    }
  };

  const renderInputs = () => {
    return codigo.map((val, i) => (
      <input
        key={i}
        id={`sms-code-${i}`}
        type="text"
        inputMode="numeric"
        maxLength="1"
        value={val}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length > 1) return;
          const newCode = [...codigo];
          newCode[i] = value;
          setCodigo(newCode);
          if (value && i < 5) document.getElementById(`sms-code-${i + 1}`)?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && !codigo[i] && i > 0) {
            document.getElementById(`sms-code-${i - 1}`)?.focus();
          }
        }}
        className="w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-black bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-mo-coral outline-none text-mo-text dark:text-white transition-all mx-1"
        autoFocus={i === 0}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header theme={theme} />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-mo-muted hover:text-mo-text dark:hover:text-white transition-colors mb-8 text-xs font-black uppercase tracking-widest"
          >
            <FaArrowLeft />
            <span>Atrás</span>
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-mo-coral/10 dark:bg-mo-coral/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-mo-coral">
              <FaMobileAlt size={24} />
            </div>
            <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">Verificación SMS</h1>
            <p className="text-mo-muted dark:text-gray-400 text-sm mt-2">Introduce el código que hemos enviado al número:</p>
            <p className="font-bold text-mo-text dark:text-gray-200 mt-1">{telefono ? `+34 ${telefono}` : '...'}</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center">
              {renderInputs()}
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-xs font-bold text-center uppercase tracking-wide">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-700 rounded-xl text-xs font-bold text-center uppercase tracking-wide">{success}</div>}

            <button
              onClick={handleVerify}
              disabled={isSubmitting || codigo.join('').length < 6}
              className="w-full py-5 bg-mo-coral text-white rounded-2xl font-display font-black text-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Verificando...' : 'Verificar e Ingresar'}
            </button>

            <div className="text-center">
              <button className="text-xs font-bold text-mo-sage uppercase tracking-widest hover:underline">Reenviar código</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerificacionSMS;