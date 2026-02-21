import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaGlobe, FaArrowLeft, FaCamera, FaSave, FaPlus, FaTrash, FaInstagram, FaTwitter, FaTiktok, FaWhatsapp, FaFacebook, FaHome } from 'react-icons/fa';
import '../../styles/core/core-ui-v11.css';
import { supabase } from '../../lib/supabase';
import { validateImageSize, IMAGE_LIMITS } from '../../utils/validators';

const FichaUsuario = () => {
    const { theme } = useTheme();
    const { user, loginManual, obtenerRedesSociales, agregarRedSocial, eliminarRedSocial, upgradeToPromoter } = useAuth();
    const navigate = useNavigate();

    // Estado para datos básicos y dirección
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        calle: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        avatar_url: ''
    });

    // Estado para redes sociales (lista dinámica)
    const [redes, setRedes] = useState([]);
    const [nuevaRed, setNuevaRed] = useState({ tipo_red: 'Instagram', url: '', customName: '' });
    const [showAddRed, setShowAddRed] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Validar teléfono español (9 dígitos, empieza por 6 o 7)
    const isPhoneValid = formData.telefono && /^[67]\d{8}$/.test(formData.telefono.replace(/\s/g, ''));

    const handleUpgradeToPromoter = async () => {
        if (!user?.telefono_verificado) {
            setMessage({ type: 'error', text: 'Debes validar tu teléfono antes de ser promotor' });
            return;
        }

        if (window.confirm('¿Confirmas que quieres convertir tu cuenta en Promotor? Podrás publicar eventos y gestionar entidades.')) {
            setIsUpgrading(true);
            const result = await upgradeToPromoter(user.id);
            setIsUpgrading(false);

            if (result.success) {
                setMessage({ type: 'success', text: '¡Cuenta mejorada! Redirigiendo...' });
                setTimeout(() => navigate('/RegistroPromotor'), 1500);
            } else {
                setMessage({ type: 'error', text: 'Error al mejorar cuenta: ' + result.error });
            }
        }
    };

    // Cargar datos iniciales
    const cargarDatos = useCallback(async () => {
        if (!user) return;

        // Inicializar con lo que ya tenemos en el contexto (mientras carga la DB)
        setFormData(prev => ({
            ...prev,
            nombre: user.nombre || '',
            apellidos: user.apellidos || '',
            email: user.email || '',
            telefono: user.telefono || '',
            avatar_url: user.avatar_url || ''
        }));

        // 1. Cargar datos del perfil con RLS (query directa)
        try {
            const { data: userData, error } = await supabase
                .from('usuarios')
                .select('id, nombre_usuario, email, telefono, telefono_verificado, tipo, nombre, apellidos, calle, numero, ciudad, provincia, codigo_postal, avatar_url')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('❌ Error al cargar perfil:', error);
            } else {
                // Actualizar contexto si hay info nueva (ej: verificación)
                if (userData.telefono_verificado !== user.telefono_verificado) {
                    loginManual({ ...user, ...userData });
                }

                setFormData(prev => ({
                    ...prev,
                    nombre: userData.nombre || user.nombre || '',
                    apellidos: userData.apellidos || user.apellidos || '',
                    email: userData.email || user.email || '',
                    telefono: userData.telefono || user.telefono || '',
                    calle: userData.calle || '',
                    numero: userData.numero || '',
                    ciudad: userData.ciudad || '',
                    provincia: userData.provincia || '',
                    codigo_postal: userData.codigo_postal ? userData.codigo_postal.toString().padStart(5, '0') : '',
                    avatar_url: userData.avatar_url || user.avatar_url || ''
                }));
            }
        } catch (fetchError) {
            console.error('💥 Error al cargar perfil:', fetchError);
        }

        // 2. Cargar redes sociales con RLS (query directa)
        try {
            console.log('🔍 Cargando redes sociales para:', user.id);
            const { data: redesData, error: redesError } = await supabase
                .from('redes_sociales')
                .select('*')
                .eq('propietario_id', user.id)
                .eq('tipo_propietario', 'usuario')
                .order('created_at', { ascending: false });

            if (redesError) {
                console.error('❌ Error cargando redes sociales:', redesError);
            } else {
                console.log('✅ Redes sociales cargadas:', redesData.length, 'redes');
                setRedes(redesData || []);
            }
        } catch (redesError) {
            console.error('💥 Error al cargar redes sociales:', redesError);
        }
    }, [user]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación estricta para código postal
        if (name === 'codigo_postal') {
            // Solo permitir números y máximo 5 dígitos
            const numericValue = value.replace(/\D/g, '').slice(0, 5);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRed = async () => {
        if (!nuevaRed.url) {
            console.warn('⚠️ URL vacía, abortando');
            return;
        }

        if (nuevaRed.tipo_red === 'Otra' && !nuevaRed.customName.trim()) {
            setMessage({ type: 'error', text: 'Por favor, especifica el nombre de la red social' });
            return;
        }

        setIsSubmitting(true);

        const redData = {
            propietario_id: user.id,
            tipo_propietario: 'usuario',
            tipo_red: nuevaRed.tipo_red === 'Otra' ? nuevaRed.customName : nuevaRed.tipo_red,
            url: nuevaRed.url,
            es_principal: false
        };

        try {
            const { data, error } = await supabase
                .from('redes_sociales')
                .insert([redData])
                .select()
                .single();

            if (error) {
                console.error('❌ Error al añadir red social:', error);
                setMessage({ type: 'error', text: `Error: ${error.message}` });
            } else {
                console.log('✅ Red social añadida:', data);
                setNuevaRed({ tipo_red: 'Instagram', url: '', customName: '' });
                setShowAddRed(false);
                setMessage({ type: 'success', text: 'Red social añadida correctamente' });
                await cargarDatos();
            }
        } catch (error) {
            console.error('💥 Error al añadir red social:', error);
            setMessage({ type: 'error', text: 'Error de conexión' });
        }

        setIsSubmitting(false);
    };

    const handleDeleteRed = async (id) => {
        if (!window.confirm('¿Eliminar esta red social?')) return;

        try {
            const { error } = await supabase
                .from('redes_sociales')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('❌ Error al eliminar:', error);
                setMessage({ type: 'error', text: 'Error al eliminar red social' });
            } else {
                setMessage({ type: 'success', text: 'Red social eliminada' });
                await cargarDatos();
            }
        } catch (error) {
            console.error('💥 Error al eliminar:', error);
            setMessage({ type: 'error', text: 'Error de conexión' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {


            // 2. Actualizar directamente en Supabase (Columnas Planas)
            const updateData = {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                calle: formData.calle,
                numero: formData.numero,
                ciudad: formData.ciudad,
                provincia: formData.provincia,
                codigo_postal: formData.codigo_postal ? parseInt(formData.codigo_postal, 10) : null,
                avatar_url: formData.avatar_url,
                updated_at: new Date().toISOString()
            };

            const response = await fetch('/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, updateData })
            });
            const result = await response.json();

            if (!result.success) {
                console.error('❌ Error al actualizar:', result.error);
                setMessage({ type: 'error', text: `Error: ${result.error}` });
            } else {
                console.log('✅ Perfil actualizado:', result.data);
                // Actualizar contexto local
                const updatedUser = { ...user, ...formData };
                loginManual(updatedUser);
                setMessage({ type: 'success', text: '¡Ficha actualizada correctamente!' });
            }
        } catch (err) {
            console.error('💥 Error al actualizar ficha:', err);
            setMessage({ type: 'error', text: `Error: ${err.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log('FichaUsuario Render: User:', user);

    if (!user) {
        return <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex items-center justify-center text-mo-text dark:text-white">Cargando perfil...</div>;
    }

    const getRedIcon = (tipo) => {
        const t = tipo.toLowerCase();
        if (t.includes('instagram')) return <FaInstagram />;
        if (t.includes('tiktok')) return <FaTiktok />;
        if (t.includes('twitter') || t === 'x') return <span className="font-bold text-[10px]">X</span>;
        if (t.includes('whatsapp')) return <FaWhatsapp />;
        if (t.includes('facebook')) return <FaFacebook />;
        return <FaGlobe />;
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-2xl mx-auto p-3 md:p-6">
                <div className="p-2">

                    {/* Avatar compacto con opción de editar */}
                    <div className="mb-3 text-center">
                        <div className="relative inline-block group">
                            <div
                                onClick={() => document.getElementById('avatar-input').click()}
                                className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-mo-muted dark:text-gray-500 border-2 border-mo-surface dark:border-gray-800 shadow-sm overflow-hidden cursor-pointer relative z-10"
                            >
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <FaCamera size={20} />
                                )}

                                {/* Overlay Hover */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaCamera className="text-white" size={16} />
                                </div>
                            </div>

                            {/* Indicador "+" mejor posicionado */}
                            <div className="absolute -bottom-1 -right-1 z-20 bg-mo-sage text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm pointer-events-none">
                                <FaPlus size={10} />
                            </div>
                        </div>

                        <input
                            type="file"
                            id="avatar-input"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                try {
                                    setMessage({ type: '', text: '' });
                                    // 1. Validar tamaño (500KB para perfiles)
                                    const validation = validateImageSize(file, IMAGE_LIMITS.USUARIO_ENTIDAD, 'el avatar');
                                    if (!validation.isValid) {
                                        setMessage({ type: 'error', text: validation.error });
                                        return;
                                    }

                                    // 2. Subir a Server (Bypass RLS)
                                    const formDataPayload = new FormData();
                                    formDataPayload.append('file', file);
                                    formDataPayload.append('userId', user.id);

                                    const response = await fetch('http://localhost:3001/api/upload-avatar', {
                                        method: 'POST',
                                        body: formDataPayload
                                    });

                                    const result = await response.json();

                                    if (!result.success) throw new Error(result.error);

                                    // 3. Actualizar estado
                                    setFormData(prev => ({ ...prev, avatar_url: result.publicUrl }));
                                    setMessage({ type: 'success', text: 'Imagen subida correctamente' });

                                } catch (error) {
                                    console.error('Error subiendo imagen:', error);
                                    setMessage({ type: 'error', text: 'Error al subir la imagen' });
                                }
                            }}
                        />

                        <h1 className="font-display text-lg font-bold text-mo-text dark:text-white mt-2">
                            {user?.nombre_usuario || 'Tu Ficha'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        {message.text && (
                            <div className={`p-2 rounded-mo font-ui text-center text-xs font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        {/* DATOS PERSONALES */}
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all text-sm"
                                    placeholder="Nombre"
                                />
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all text-sm"
                                    placeholder="Apellidos"
                                />
                            </div>
                            {/* Email con botón Cambiar */}
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="flex-1 p-2 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-mo font-ui text-mo-muted dark:text-gray-500 text-xs cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => navigate('/RegistroEmail')}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-mo-text dark:text-white text-xs font-bold rounded-mo hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cambiar
                                </button>
                            </div>

                            {/* Teléfono con botón Añadir/Cambiar/Validar */}
                            <div className="flex gap-2">
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    readOnly
                                    disabled
                                    className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl font-ui text-mo-muted dark:text-gray-500 text-sm cursor-not-allowed"
                                    placeholder="Sin teléfono vinculado"
                                />
                                {user?.telefono_verificado ? (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/RegistroMovil')}
                                        className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-mo-text dark:text-white text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cambiar
                                    </button>
                                ) : formData.telefono ? (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/RegistroMovil', { state: { telefono: formData.telefono } })}
                                        className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                                    >
                                        Validar
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/RegistroMovil')}
                                        className="px-4 py-3 bg-mo-sage hover:bg-mo-olive text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                                    >
                                        Añadir
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* DIRECCIÓN */}
                        <div className="space-y-2">
                            <div className="grid grid-cols-[3fr_1fr] gap-2">
                                <input
                                    type="text"
                                    name="calle"
                                    value={formData.calle}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-xl outline-none text-mo-text dark:text-white transition-all shadow-sm text-sm"
                                    placeholder="Calle / Av. / Plaza"
                                />
                                <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-xl outline-none text-mo-text dark:text-white transition-all shadow-sm text-sm"
                                    placeholder="Nº"
                                />
                            </div>
                            <div className="grid grid-cols-[2fr_2fr_1fr] gap-2">
                                <input
                                    type="text"
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all text-sm"
                                    placeholder="Ciudad"
                                />
                                <input
                                    type="text"
                                    name="provincia"
                                    value={formData.provincia}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all text-sm"
                                    placeholder="Provincia"
                                />
                                <input
                                    type="text"
                                    name="codigo_postal"
                                    value={formData.codigo_postal}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 focus:border-mo-sage rounded-mo font-ui outline-none text-mo-text dark:text-white transition-all text-sm"
                                    placeholder="C.P."
                                />
                            </div>
                        </div>

                        {/* REDES SOCIALES */}
                        <div className="space-y-2">
                            <div className="grid grid-cols-1">
                                {redes.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-mo overflow-hidden">
                                        {redes.map((red, index) => (
                                            <div key={red.id} className={`flex items-center p-2 gap-3 ${index !== redes.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                                                <div className="shrink-0 w-8 h-8 rounded-mo font-ui bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-mo-sage">
                                                    {getRedIcon(red.tipo_red)}
                                                </div>

                                                <div className="font-bold text-sm min-w-[70px]">
                                                    {red.tipo_red}
                                                </div>

                                                <div className="text-sm text-mo-muted truncate flex-1">
                                                    {red.url}
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteRed(red.id)}
                                                    className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {showAddRed ? (
                                <div className="p-4 bg-mo-sage/5 dark:bg-mo-sage/10 rounded-mo border-2 border-dashed border-mo-sage/30 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex flex-col gap-3">
                                        <select
                                            value={nuevaRed.tipo_red}
                                            onChange={(e) => setNuevaRed({ ...nuevaRed, tipo_red: e.target.value, customName: '' })}
                                            className="p-3 bg-white dark:bg-gray-800 border-none rounded-xl outline-none text-xs font-bold uppercase tracking-widest text-mo-text dark:text-white shadow-soft"
                                        >
                                            <option>Instagram</option>
                                            <option>TikTok</option>
                                            <option>X</option>
                                            <option>Web</option>
                                            <option>Facebook</option>
                                            <option>WhatsApp</option>
                                            <option>Otra</option>
                                        </select>

                                        {/* Campo de nombre personalizado (solo si es "Otra") */}
                                        {nuevaRed.tipo_red === 'Otra' && (
                                            <input
                                                type="text"
                                                value={nuevaRed.customName}
                                                onChange={(e) => setNuevaRed({ ...nuevaRed, customName: e.target.value })}
                                                className="p-3 bg-white dark:bg-gray-800 border-none rounded-xl outline-none text-sm text-mo-text dark:text-white shadow-soft"
                                                placeholder="Nombre de la red (ej: LinkedIn, YouTube...)"
                                            />
                                        )}

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={nuevaRed.url}
                                                onChange={(e) => setNuevaRed({ ...nuevaRed, url: e.target.value })}
                                                className="flex-1 p-3 bg-white dark:bg-gray-800 border-none rounded-xl outline-none text-sm text-mo-text dark:text-white shadow-soft"
                                                placeholder="@usuario o url..."
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddRed}
                                                disabled={isSubmitting}
                                                className="p-3 bg-mo-sage text-white rounded-mo shadow-mo-soft active:scale-95"
                                            >
                                                <FaPlus size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddRed(false)}
                                                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-mo shadow-mo-softmd active:scale-95"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowAddRed(true)}
                                    className="w-full py-3 bg-mo-sage hover:bg-mo-olive text-white rounded-mo shadow-mo-soft flex items-center justify-center gap-2 group hover:scale-[1.02] transition-all"
                                >
                                    <FaPlus className="group-hover:rotate-90 transition-transform" size={12} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Añadir red social</span>
                                </button>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => navigate('/RegistroCliente')}
                                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-mo-text dark:text-white rounded-mo font-cta font-bold text-base shadow-mo-soft active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <FaHome size={16} />
                                Principal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-mo-olive hover:opacity-90 text-white rounded-mo font-cta font-bold text-base shadow-mo-soft active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <FaSave size={16} />
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>

                        {/* ZONA PROMOTOR */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div className="bg-mo-sage/5 dark:bg-mo-sage/10 p-4 rounded-mo border border-mo-sage/20">
                                <h3 className="font-display font-bold text-mo-text dark:text-gray-100 mb-2 flex items-center gap-2">
                                    <span className="text-xl">🎉</span> ¿Eres promotor de actividades?
                                </h3>

                                <div className="space-y-3">
                                    <p className="text-sm text-mo-muted dark:text-gray-400">
                                        Si organizas eventos y quieres darlos a conocer, actualiza tu cuenta a Promotor.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleUpgradeToPromoter}
                                        disabled={!user?.telefono_verificado || isUpgrading}
                                        className={`w-full py-3 rounded-mo font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2
                                            ${!user?.telefono_verificado
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-mo-spot to-mo-amber text-white hover:shadow-lg active:scale-[0.98]'
                                            }`}
                                    >
                                        {isUpgrading ? (
                                            <span>Procesando...</span>
                                        ) : !user?.telefono_verificado ? (
                                            <span>⚠️ Necesita Validar Teléfono</span>
                                        ) : (
                                            <>
                                                Pasar a Promotor
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <div className="text-center mt-8 mb-4 text-[10px] text-mo-muted dark:text-gray-500">
                Si desea dar de baja su usuario pulse <button onClick={() => navigate('/BajaUsuario')} className="underline hover:text-red-500 transition-colors font-bold cursor-pointer bg-transparent border-none p-0 inline">aquí</button>
            </div>

            <Footer />
        </div>
    );
};

export default FichaUsuario;
