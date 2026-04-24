import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaSave, FaArrowLeft, FaCalendarAlt, FaImage, FaMapMarkerAlt, FaClock, FaPlus, FaMusic, FaStore, FaInstagram, FaGlobe, FaFacebook, FaTiktok, FaTwitter, FaYoutube, FaTrash, FaSearch } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { validateImageSize, IMAGE_LIMITS } from '../../utils/validators';
import QuickLocalModal from '../../components/QuickLocalModal';
import QuickAmenizadorModal from '../../components/QuickAmenizadorModal';
import EntitySelectorModal from '../../components/EntitySelectorModal';
import GeographyInputs from '../../components/GeographyInputs';
import '../../styles/core/core-ui-v11.css';

const EventoForm = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const entidadId = searchParams.get('entidad');

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        categoria_id: '',
        provincia: '',
        localidad: '',
        lugar_manual: '',
        imagen_url: '',
        entidad_id: entidadId || '',
        entidad_local_id: '',
        entidad_amenizador_id: '',
        amenizador: '',
        url_evento: '', // URL de Google Maps
        codigo_postal: '',
        guest_social: '', // Redes del invitado (Instagram, Web, etc.)
        promotor: ''
    });

    const [socials, setSocials] = useState([]);
    const [newSocial, setNewSocial] = useState({ tipo: 'instagram', url: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAmenizadorModalOpen, setIsAmenizadorModalOpen] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectorType, setSelectorType] = useState('local');

    const [locales, setLocales] = useState([]);
    const [amenizadores, setAmenizadores] = useState([]);
    const [localidadesExistentes, setLocalidadesExistentes] = useState([]);
    const [entidadesUsuario, setEntidadesUsuario] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [fechaHora, setFechaHora] = useState({ fecha: '', hora: '20', minuto: '00' });

    const [fechaHoraFin, setFechaHoraFin] = useState({ fecha: '', hora: '23', minuto: '00' });

    const handleFechaChange = (field, value, isFin = false) => {
        if (isFin) {
            const nuevo = { ...fechaHoraFin, [field]: value };
            setFechaHoraFin(nuevo);
            if (nuevo.fecha) {
                const iso = `${nuevo.fecha}T${nuevo.hora.padStart(2, '0')}:${nuevo.minuto}:00`;
                setFormData(prev => ({ ...prev, fecha_fin: iso }));
            }
        } else {
            const nuevo = { ...fechaHora, [field]: value };
            setFechaHora(nuevo);
            if (nuevo.fecha) {
                const startIso = `${nuevo.fecha}T${nuevo.hora.padStart(2, '0')}:${nuevo.minuto}:00`;
                setFormData(prev => ({ ...prev, fecha_inicio: startIso }));
                
                // Validación reactiva: Si no hay fin o el fin es anterior/igual al nuevo inicio,
                // ponemos un fin por defecto (ej: +3 horas)
                const start = new Date(startIso);
                const end = formData.fecha_fin ? new Date(formData.fecha_fin) : null;
                
                if (!end || end <= start) {
                    const defaultEnd = new Date(start.getTime() + 3 * 60 * 60 * 1000);
                    const d = defaultEnd.toISOString().split('T')[0];
                    const h = defaultEnd.getHours().toString().padStart(2, '0');
                    setFechaHoraFin({ fecha: d, hora: h, minuto: '00' });
                    setFormData(prev => ({ ...prev, fecha_fin: defaultEnd.toISOString() }));
                }
            }
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/RegistroPromotor');
            return;
        }

        const fetchData = async () => {
            try {
                const { data: cats } = await supabase
                    .from('categorias')
                    .select('id, nombre, icono_emoji')
                    .order('nombre', { ascending: true });
                if (cats) setCategorias(cats);

                const { data, error } = await supabase
                    .from('entidades')
                    .select('id, nombre, calle, numero, ciudad, provincia, tipo_entidad, direccion, codigo_postal')
                    .eq('usuario_id', user.id)
                    .order('nombre', { ascending: true });

                if (!error && data) {
                    setEntidadesUsuario(data);
                    setLocales(data.filter(e => e.tipo_entidad === 'local'));
                    
                    const { data: allArtists } = await supabase
                        .from('entidades')
                        .select('id, nombre, tipo_entidad, ciudad, provincia')
                        .eq('tipo_entidad', 'amenizador')
                        .order('nombre', { ascending: true });
                    
                    if (allArtists) setAmenizadores(allArtists);

                    const { data: allCities } = await supabase
                        .from('entidades')
                        .select('ciudad')
                        .not('ciudad', 'is', null);
                    
                    if (allCities) {
                        const uniqueCities = [...new Set(allCities.map(c => c.ciudad))].sort();
                        setLocalidadesExistentes(uniqueCities);
                    }

                    const nombrePromotor = user.nombre_usuario || user.nombre || user.email;
                    setFormData(prev => ({ ...prev, promotor: nombrePromotor }));

                    const aplicarHerencia = (origen) => {
                        if (!origen) return {};
                        if (origen.tipo_entidad === 'local') {
                            const calleFinal = [origen.calle, origen.numero].filter(Boolean).join(', ');
                            return {
                                entidad_local_id: origen.id,
                                ubicacion: calleFinal || '',
                                localidad: origen.ciudad || '',
                                provincia: origen.provincia || '',
                                codigo_postal: origen.codigo_postal || '',
                                ubicacion_coords: undefined, // Obsoleto
                                url_evento: origen.direccion || '',
                                entidad_amenizador_id: '',
                                amenizador: ''
                            };
                        }
                        if (origen.tipo_entidad === 'amenizador') {
                            return {
                                entidad_amenizador_id: origen.id,
                                amenizador: origen.nombre,
                                entidad_local_id: '',
                                ubicacion: '',
                                localidad: '',
                                provincia: ''
                            };
                        }
                        return {};
                    };

                    if (entidadId) {
                        const origen = data.find(e => e.id === entidadId);
                        if (origen) {
                            setFormData(prev => ({ ...prev, entidad_id: entidadId, ...aplicarHerencia(origen) }));
                        }
                    } else if (data.length === 1) {
                        setFormData(prev => ({ ...prev, entidad_id: data[0].id, ...aplicarHerencia(data[0]) }));
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [user, entidadId, navigate]);

    const handleLocalChange = (e) => {
        const localId = e.target.value;
        if (!localId) {
            setFormData(prev => ({
                ...prev,
                entidad_local_id: '',
                ubicacion: '',
                localidad: '',
                provincia: '',
                codigo_postal: '',
                ubicacion_coords: undefined,
                url_evento: '',
                lugar_manual: ''
            }));
            return;
        }

        const selectedLocal = locales.find(l => l.id === localId);
        if (selectedLocal) {
            setFormData(prev => ({
                ...prev,
                entidad_local_id: localId,
                ubicacion: [selectedLocal.calle, selectedLocal.numero].filter(Boolean).join(', ') || selectedLocal.ubicacion || '',
                localidad: selectedLocal.ciudad || '',
                provincia: selectedLocal.provincia || '',
                codigo_postal: selectedLocal.codigo_postal || '',
                ubicacion_coords: undefined,
                url_evento: selectedLocal.direccion || '',
                lugar_manual: ''
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Protocolo Sitio Libre: Si el usuario edita manualmente campos de ubicación, 
        // rompemos el vínculo con la entidad de la base de datos (entidad_local_id o entidad_amenizador_id)
        if (['ubicacion', 'localidad', 'provincia', 'url_evento', 'codigo_postal', 'amenizador', 'lugar_manual', 'guest_social'].includes(name)) {
            setFormData(prev => ({ 
                ...prev, 
                [name]: value, 
                entidad_local_id: name === 'lugar_manual' ? '' : prev.entidad_local_id,
                entidad_amenizador_id: name === 'amenizador' ? '' : prev.entidad_amenizador_id
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLocalCreated = (nuevoLocal) => {
        setLocales(prev => [...prev, nuevoLocal]);
        setEntidadesUsuario(prev => [...prev, nuevoLocal]);
        const calleFinal = [nuevoLocal.calle, nuevoLocal.numero].filter(Boolean).join(', ');
        setFormData(prev => ({
            ...prev,
            entidad_local_id: nuevoLocal.id,
            ubicacion: calleFinal || '',
            localidad: nuevoLocal.ciudad || '',
            provincia: nuevoLocal.provincia || '',
            codigo_postal: nuevoLocal.codigo_postal || '',
            ubicacion_coords: undefined,
            url_evento: nuevoLocal.direccion || '',
            lugar_manual: ''
        }));
    };

    const handleAmenizadorCreated = (nuevoArtist) => {
        setAmenizadores(prev => [...prev, nuevoArtist]);
        setFormData(prev => ({
            ...prev,
            entidad_amenizador_id: nuevoArtist.id,
            amenizador: nuevoArtist.nombre,
            localidad: nuevoArtist.ciudad || prev.localidad,
            provincia: nuevoArtist.provincia || prev.provincia
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const validation = validateImageSize(file, IMAGE_LIMITS.EVENTO, 'el cartel/imagen del evento');
        if (!validation.isValid) {
            setMessage({ type: 'error', text: validation.error });
            e.target.value = '';
            return;
        }
        if (message.type === 'error') setMessage({ type: '', text: '' });
        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prev => ({ ...prev, imagen_url: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddSocial = (e) => {
        e.preventDefault();
        if (!newSocial.url) return;
        setSocials([...socials, { id: Date.now(), tipo_red: newSocial.tipo, url: newSocial.url, isPending: true }]);
        setNewSocial({ ...newSocial, url: '' });
    };

    const handleDeleteSocial = (socialId) => {
        setSocials(socials.filter(s => s.id !== socialId));
    };

    const getSocialIcon = (tipo) => {
        switch (tipo) {
            case 'instagram': return <FaInstagram className="text-pink-600" />;
            case 'facebook': return <FaFacebook className="text-blue-600" />;
            case 'tiktok': return <FaTiktok className="text-black dark:text-white" />;
            case 'twitter': return <FaTwitter className="text-blue-400" />;
            case 'youtube': return <FaYoutube className="text-red-600" />;
            case 'entradas': return <FaGlobe className="text-mo-sage" />;
            default: return <FaGlobe className="text-gray-600" />;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        if (!formData.titulo.trim() || !formData.fecha_inicio) {
            setMessage({ type: 'error', text: 'El título y la fecha son obligatorios' });
            setIsSubmitting(false);
            return;
        }

        try {
            const creadorNombre = user.nombre_usuario || user.nombre || user.email;
            
            // Función auxiliar para validar UUIDs
            const isValidUUID = (id) => {
                if (!id || typeof id !== 'string') return false;
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            };

            // CONSTRUCCIÓN MANUAL Y EXPLÍCITA (WHITELIST)
            const finalPayload = {
                titulo: formData.titulo.trim(),
                descripcion: formData.descripcion.trim(),
                fecha_inicio: formData.fecha_inicio ? new Date(formData.fecha_inicio).toISOString() : null,
                fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString() : null,
                imagen_url: formData.imagen_url || null,
                categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null,
                ubicacion: formData.ubicacion || formData.lugar_manual || '',
                localidad: formData.localidad || 'Varios',
                provincia: formData.provincia || 'Varios',
                lugar_manual: formData.lugar_manual || '',
                url_evento: formData.url_evento || '',
                amenizador: formData.amenizador || '',
                
                // Campos técnicos obligatorios
                precio_actual: 'Gratis',
                tipo: 'evento',
                visibilidad: 'publico',
                app_origen: 'estanoche',
                estado: 'activo',

                // Auditoría (Aseguramos que sean UUID válidos o null)
                creador_id: isValidUUID(user.id) ? user.id : null,
                creador_nombre: creadorNombre,
                modificador_id: isValidUUID(user.id) ? user.id : null,
                modificador_nombre: creadorNombre
            };

            // IDs de Relación (Solo si son UUID válidos)
            if (isValidUUID(formData.entidad_local_id)) {
                finalPayload.entidad_local_id = formData.entidad_local_id;
            }
            if (isValidUUID(formData.entidad_amenizador_id)) {
                finalPayload.entidad_amenizador_id = formData.entidad_amenizador_id;
            }
            if (isValidUUID(formData.entidad_id)) {
                finalPayload.entidad_id = formData.entidad_id;
            }

            console.log('👤 Usuario actual:', user);
            console.log('🚀 Payload final (Whitelist):', finalPayload);

            // Validación final de cronología si hay fin
            if (finalPayload.fecha_inicio && finalPayload.fecha_fin) {
                const start = new Date(finalPayload.fecha_inicio);
                const end = new Date(finalPayload.fecha_fin);
                if (end <= start) {
                    setMessage({ type: 'error', text: 'La fecha de finalización no puede ser anterior o igual a la de inicio' });
                    setIsSubmitting(false);
                    return;
                }
            }

            const { data: nuevoEvento, error } = await supabase
                .from('eventos')
                .insert([finalPayload])
                .select()
                .single();

            if (error) throw error;

            if (socials.length > 0 || formData.guest_social) {
                const redesParaInsertar = [
                    ...socials.map(s => ({
                        propietario_id: nuevoEvento.id,
                        tipo_propietario: 'evento',
                        tipo_red: s.tipo_red,
                        url: s.url
                    }))
                ];

                if (formData.guest_social) {
                    redesParaInsertar.push({
                        propietario_id: nuevoEvento.id,
                        tipo_propietario: 'evento',
                        tipo_red: 'guest_social', // Identificador especial para red del invitado
                        url: formData.guest_social
                    });
                }
                
                await supabase.from('redes_sociales').insert(redesParaInsertar);
            }

            setMessage({ type: 'success', text: 'Evento publicado correctamente' });
            setTimeout(() => navigate(`/entidad/${formData.entidad_id}`), 1500);
        } catch (error) {
            console.error('Error al guardar el evento:', error);
            setMessage({ type: 'error', text: 'Error al publicar el evento: ' + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isHostLocal = entidadesUsuario.find(e => e.id === formData.entidad_id)?.tipo_entidad === 'local';
    const hostEntity = entidadesUsuario.find(e => e.id === formData.entidad_id);

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8">
                <div className="bg-white dark:bg-gray-800 rounded-mo shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <FaArrowLeft size={16} className="text-mo-muted" />
                        </button>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">
                            Nuevo Evento
                        </h1>
                    </div>

                    {/* Mensaje de Feedback */}
                    {message.text && (
                        <div className={`fixed bottom-6 left-1/2 z-50 p-4 rounded-mo font-ui shadow-2xl flex items-start gap-4 animate-slide-up-center bg-white dark:bg-gray-800 border-l-4 w-[90%] max-w-md ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="flex-1">
                                <p className={`text-sm font-bold ${message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {message.type === 'success' ? 'Éxito' : 'Aviso'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{message.text}</p>
                            </div>
                            <button type="button" onClick={() => setMessage({ type: '', text: '' })} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">✕</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* 1. ANFITRIÓN (LOCAL O ARTISTA QUE ORGANIZA) */}
                        <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-2">Organizador Anfitrión</label>
                            <div className={`p-4 rounded-2xl border-2 border-mo-sage bg-mo-sage/5 flex items-center gap-4 transition-all`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-mo-sage text-white`}>
                                    {isHostLocal ? <FaStore size={18} /> : <FaMusic size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-mo-text dark:text-white truncate">
                                        {hostEntity?.nombre || 'Cargando organizador...'}
                                    </p>
                                    <p className="text-[10px] text-mo-muted truncate uppercase tracking-tighter">
                                        {hostEntity?.ciudad || 'Localidad del anfitrión'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. FECHA Y HORA */}
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-3xl space-y-6 border border-gray-100 dark:border-gray-700">
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-1">Comienzo del Evento *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="date" value={fechaHora.fecha} onChange={e => handleFechaChange('fecha', e.target.value)} className="p-4 bg-white dark:bg-gray-800 rounded-2xl outline-none text-sm dark:text-white shadow-sm border border-transparent focus:border-mo-sage" required />
                                    <div className="flex gap-2">
                                        <select value={fechaHora.hora} onChange={e => handleFechaChange('hora', e.target.value)} className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-2xl text-sm dark:text-white outline-none">
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const h = i.toString().padStart(2, '0');
                                                return <option key={h} value={h}>{h}:00</option>;
                                            })}
                                        </select>
                                        <select value={fechaHora.minuto} onChange={e => handleFechaChange('minuto', e.target.value)} className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-2xl text-sm dark:text-white outline-none">
                                            {['00','10','20','30','40','50'].map(m => <option key={m} value={m}>+{m} min</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-1">Finalización (Opcional)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="date" value={fechaHoraFin.fecha} onChange={e => handleFechaChange('fecha', e.target.value, true)} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl text-sm dark:text-white outline-none" />
                                    <div className="flex gap-2">
                                        <select value={fechaHoraFin.hora} onChange={e => handleFechaChange('hora', e.target.value, true)} className="flex-1 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl text-sm dark:text-white outline-none">
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const h = i.toString().padStart(2, '0');
                                                return <option key={h} value={h}>{h}:00</option>;
                                            })}
                                        </select>
                                        <select value={fechaHoraFin.minuto} onChange={e => handleFechaChange('minuto', e.target.value, true)} className="flex-1 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl text-sm dark:text-white outline-none">
                                            {['00','10','20','30','40','50'].map(m => <option key={m} value={m}>+{m} min</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. INVITADO / LOCALIZACIÓN (PROTOCOLO SITIO LIBRE) */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] space-y-6 border border-gray-100 dark:border-gray-700 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                {isHostLocal ? <FaMusic size={80} /> : <FaStore size={80} />}
                            </div>

                            <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-2">
                                {isHostLocal ? 'Datos del Artista Invitado' : 'Localización / Lugar del Evento'}
                            </label>

                            {/* A. FILTRO GEOGRÁFICO (PROTOCOLO: PRIMERO PROVINCIA/CIUDAD) */}
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <GeographyInputs 
                                    provinciaValue={formData.provincia}
                                    municipioValue={formData.localidad}
                                    cpValue={formData.codigo_postal}
                                    onChange={handleChange}
                                    hideCp={isHostLocal}
                                />
                            </div>

                            {/* B. NOMBRE Y BUSCADOR */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-[8px] uppercase tracking-widest font-bold text-mo-muted mb-1 ml-2">Nombre del {isHostLocal ? 'Artista' : 'Local'}</label>
                                        <input 
                                            type="text" 
                                            name={isHostLocal ? 'amenizador' : 'lugar_manual'} 
                                            value={isHostLocal ? formData.amenizador : formData.lugar_manual} 
                                            onChange={handleChange}
                                            placeholder="Escribe el nombre..."
                                            className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl outline-none text-sm dark:text-white border border-gray-100 dark:border-gray-700 shadow-sm focus:border-mo-sage transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setSelectorType(isHostLocal ? 'amenizador' : 'local');
                                                setIsSelectorOpen(true);
                                            }}
                                            className="p-4 bg-mo-sage text-white rounded-2xl shadow-lg hover:bg-mo-olive transition-all active:scale-95 flex items-center gap-2 font-bold text-xs"
                                        >
                                            <FaSearch />
                                            Localizar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* C. DATOS ADICIONALES (DIRECCIÓN / MAPS / REDES) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {!isHostLocal && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="block text-[8px] uppercase tracking-widest font-bold text-mo-muted ml-2">Calle y Número (Si aplica)</label>
                                            <input 
                                                type="text" 
                                                name="ubicacion" 
                                                value={formData.ubicacion} 
                                                onChange={handleChange}
                                                placeholder="Ej: Calle Mayor, 12"
                                                className="w-full p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl outline-none text-xs dark:text-white border border-gray-100 dark:border-gray-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[8px] uppercase tracking-widest font-bold text-mo-muted ml-2">Enlace Google Maps</label>
                                            <input 
                                                type="url" 
                                                name="url_evento" 
                                                value={formData.url_evento || ''} 
                                                onChange={handleChange}
                                                placeholder="https://maps.app.goo.gl/..."
                                                className="w-full p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl outline-none text-xs dark:text-white border border-gray-100 dark:border-gray-700"
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <div className="space-y-2 col-span-full">
                                    <label className="block text-[8px] uppercase tracking-widest font-bold text-mo-muted ml-2">Redes / Web del {isHostLocal ? 'Artista' : 'Local'}</label>
                                    <input 
                                        type="text" 
                                        name="guest_social" 
                                        value={formData.guest_social || ''} 
                                        onChange={handleChange}
                                        placeholder="Ej: Instagram, Spotify o Web del invitado"
                                        className="w-full p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl outline-none text-xs dark:text-white border border-gray-100 dark:border-gray-700 shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. TÍTULO, CATEGORÍA Y DESCRIPCIÓN */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-2">Título del Evento *</label>
                                    <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-2xl outline-none text-sm dark:text-white" placeholder="Ej: Noche de Jazz..." required />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-2">Categoría</label>
                                    <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white">
                                        <option value="">-- Sin categoria --</option>
                                        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-2">Descripción</label>
                                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white resize-none" placeholder="Detalles sobre el evento..." />
                            </div>
                        </div>

                        {/* 5. PRESENCIA DIGITAL */}
                        <div className="p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-1">Presencia Digital (Entradas / Redes)</label>
                            <div className="flex gap-2">
                                <select value={newSocial.tipo} onChange={(e) => setNewSocial({ ...newSocial, tipo: e.target.value })} className="w-24 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] uppercase font-bold outline-none">
                                    <option value="entradas">🎟 Entradas</option>
                                    <option value="instagram">📸 Insta</option>
                                    <option value="facebook">👥 FB</option>
                                </select>
                                <input type="url" value={newSocial.url} onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })} className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs outline-none" placeholder="Enlace (https://...)" />
                                <button type="button" onClick={handleAddSocial} className="p-3 bg-mo-sage text-white rounded-xl shadow-md"><FaPlus size={14} /></button>
                            </div>
                            <div className="space-y-2">
                                {socials.map(social => (
                                    <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-xs text-mo-text dark:text-white">
                                        <div className="flex items-center gap-2">{getSocialIcon(social.tipo_red)} {social.url}</div>
                                        <button type="button" onClick={() => handleDeleteSocial(social.id)} className="text-red-400"><FaTrash size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 6. CARTEL */}
                        <div className="space-y-4">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-mo-muted px-2 text-center">Cartel del Evento</label>
                            <div className="flex justify-center">
                                <div onClick={() => document.getElementById('poster-input').click()} className="w-full max-w-[320px] aspect-[4/5] rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-mo-sage transition-all group relative">
                                    {formData.imagen_url ? <img src={formData.imagen_url} alt="Cartel" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center opacity-30 group-hover:opacity-100 transition-opacity"><FaImage size={48} className="mb-4" /><span className="text-xs font-black uppercase tracking-widest">Subir Imagen</span></div>}
                                </div>
                                <input id="poster-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'imagen_url')} />
                            </div>
                        </div>

                        {/* 7. PUBLICAR */}
                        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-mo-sage hover:bg-mo-olive text-white rounded-[2rem] font-bold text-lg shadow-mo-soft transition-all active:scale-[0.98] mt-4">
                            {isSubmitting ? 'Publicando...' : 'Publicar Evento Ahora'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
            <QuickLocalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={handleLocalCreated} userId={user?.id} />
            <QuickAmenizadorModal isOpen={isAmenizadorModalOpen} onClose={() => setIsAmenizadorModalOpen(false)} onCreated={handleAmenizadorCreated} userId={user?.id} />
            <EntitySelectorModal
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                type={selectorType}
                initialProvincia={formData.provincia}
                initialCiudad={formData.ciudad}
                onSelect={(item) => {
                    if (selectorType === 'local') {
                        setFormData(prev => ({
                            ...prev,
                            entidad_local_id: item.id,
                            lugar_manual: item.nombre,
                            ubicacion: [item.calle, item.numero].filter(Boolean).join(', ') || '',
                            localidad: item.ciudad || '',
                            provincia: item.provincia || '',
                            codigo_postal: item.codigo_postal || '',
                            url_evento: item.direccion || '' // La URL de Maps está en 'direccion' en entidades
                        }));
                    } else {
                        setFormData(prev => ({ 
                            ...prev, 
                            entidad_amenizador_id: item.id, 
                            amenizador: item.nombre,
                            localidad: item.ciudad || prev.localidad,
                            provincia: item.provincia || prev.provincia
                        }));
                    }
                }}
                onOpenCreate={() => selectorType === 'local' ? setIsModalOpen(true) : setIsAmenizadorModalOpen(true)}
            />
        </div>
    );
};

export default EventoForm;
