import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaSave, FaArrowLeft, FaStore, FaMusic, FaTheaterMasks, FaCamera, FaPlus, FaInstagram, FaGlobe, FaFacebook, FaTiktok, FaTwitter, FaYoutube, FaTrash } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { validateImageSize, IMAGE_LIMITS } from '../../utils/validators';
import '../../styles/core/core-ui-v11.css';

const EntidadForm = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        tipo_entidad: 'local',
        descripcion: '',
        calle: '',
        numero: '',
        ciudad: '',
        codigo_postal: '',
        provincia: '',
        avatar_url: '',
        banner_url: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Estado para redes sociales (SOLO EDICIÓN)
    const [socials, setSocials] = useState([]);
    const [newSocial, setNewSocial] = useState({ tipo: 'instagram', url: '' });
    const [loadingSocials, setLoadingSocials] = useState(false);

    // Estado para Galería de Imágenes (SOLO EDICIÓN)
    const [gallery, setGallery] = useState([]);
    const [pendingGallery, setPendingGallery] = useState([]); // Imágenes pendientes de subir (Creación)
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (!user || user.tipo !== 'promotor') {
            navigate('/RegistroPromotor');
            return;
        }

        if (isEditing) {
            cargarEntidad();
            cargarRedesSociales();
            cargarGaleria();
        }
    }, [user, id]);

    const cargarEntidad = async () => {
        try {
            const { data, error } = await supabase
                .from('entidades')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setFormData({
                nombre: data.nombre || '',
                tipo_entidad: data.tipo_entidad || 'local',
                descripcion: data.descripcion || '',
                calle: data.calle || '',
                numero: data.numero || '',
                ciudad: data.ciudad || '',
                codigo_postal: data.codigo_postal || '',
                provincia: data.provincia || '',
                avatar_url: data.avatar_url || '',
                banner_url: data.banner_url || ''
            });
        } catch (error) {
            console.error('Error cargando entidad:', error);
            setMessage({ type: 'error', text: 'Error al cargar la entidad' });
        }
    };

    const cargarRedesSociales = async () => {
        try {
            setLoadingSocials(true);
            const { data, error } = await supabase
                .from('redes_sociales')
                .select('*')
                .eq('propietario_id', id)
                .eq('tipo_propietario', 'entidad');

            if (error) throw error;
            setSocials(data || []);
        } catch (error) {
            console.error('Error cargando redes:', error);
        } finally {
            setLoadingSocials(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño (500KB para entidades)
        const validation = validateImageSize(file, IMAGE_LIMITS.USUARIO_ENTIDAD, field === 'avatar_url' ? 'el logo/avatar' : 'el banner');

        if (!validation.isValid) {
            setMessage({ type: 'error', text: validation.error });
            // Limpiar el input para permitir re-selección
            e.target.value = '';
            return;
        }

        // Si es válido, limpiar error previo si lo hubiera
        if (message.type === 'error') setMessage({ type: '', text: '' });

        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prev => ({ ...prev, [field]: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const cargarGaleria = async () => {
        try {
            const { data, error } = await supabase
                .from('imagenes_entidad')
                .select('*')
                .eq('entidad_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGallery(data || []);
        } catch (error) {
            console.error('Error cargando galería:', error);
        }
    };

    const handleGalleryUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImage(true);
        try {
            for (const file of files) {
                const fileSize = file.size / 1024 / 1024; // MB
                if (fileSize > 2) {
                    setMessage({ type: 'error', text: `La imagen ${file.name} excede 2MB` });
                    continue;
                }

                // Usamos FileReader para base64 por ahora
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64 = event.target.result;

                    if (!isEditing) {
                        // Modo creación: Guardamos en estado local pendiente
                        setPendingGallery(prev => [...prev, {
                            id: Date.now() + Math.random(), // ID temporal para el listado
                            url: base64,
                            is_main: false,
                            isPending: true
                        }]);
                    } else {
                        // Modo edición: Subimos directamente a Supabase
                        const { data, error } = await supabase
                            .from('imagenes_entidad')
                            .insert([{
                                entidad_id: id,
                                url: base64,
                                is_main: false
                            }])
                            .select()
                            .single();

                        if (!error && data) {
                            setGallery(prev => [data, ...prev]);
                        } else if (error) {
                            console.error('Error subiendo a Supabase:', error);
                            setMessage({ type: 'error', text: 'Error al subir imagen a la base de datos' });
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
            setMessage({ type: 'success', text: 'Imágenes añadidas a la galería' });
        } catch (error) {
            console.error('Error subiendo imágenes:', error);
            setMessage({ type: 'error', text: 'Error al subir imágenes' });
        } finally {
            setUploadingImage(false);
            // Limpiar input
            e.target.value = '';
        }
    };



    const handleDeleteImage = async (imgId, isPending = false) => {
        if (!window.confirm('¿Eliminar esta imagen?')) return;

        if (isPending) {
            setPendingGallery(prev => prev.filter(img => img.id !== imgId));
            return;
        }

        try {
            const { error } = await supabase
                .from('imagenes_entidad')
                .delete()
                .eq('id', imgId);

            if (error) throw error;
            setGallery(gallery.filter(img => img.id !== imgId));
        } catch (error) {
            console.error('Error borrando imagen:', error);
        }
    };

    const handleSetMainImage = (imgUrl) => {
        setFormData(prev => ({ ...prev, banner_url: imgUrl }));
        setMessage({ type: 'success', text: 'Portada actualizada' });
    };

    const handleAddSocial = async (e) => {
        e.preventDefault();
        if (!newSocial.url) return;

        try {
            if (!isEditing) {
                // Modo creación: Guardamos localmente
                const tempId = Date.now();
                setSocials([...socials, {
                    id: tempId,
                    tipo_red: newSocial.tipo,
                    url: newSocial.url,
                    isPending: true
                }]);
                setNewSocial({ ...newSocial, url: '' });
                setMessage({ type: 'success', text: 'Red social añadida localmente' });
            } else {
                // Modo edición: Supabase
                const { data, error } = await supabase
                    .from('redes_sociales')
                    .insert([{
                        propietario_id: id,
                        tipo_propietario: 'entidad',
                        tipo_red: newSocial.tipo,
                        url: newSocial.url
                    }])
                    .select()
                    .single();

                if (error) throw error;

                setSocials([...socials, data]);
                setNewSocial({ ...newSocial, url: '' });
                setMessage({ type: 'success', text: 'Red social añadida' });
            }
        } catch (error) {
            console.error('Error añadiendo red:', error);
            setMessage({ type: 'error', text: 'Error al añadir red social' });
        }
    };

    const handleDeleteSocial = async (socialId) => {
        try {
            const { error } = await supabase
                .from('redes_sociales')
                .delete()
                .eq('id', socialId);

            if (error) throw error;

            setSocials(socials.filter(s => s.id !== socialId));
        } catch (error) {
            console.error('Error borrando red:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // Validaciones básicas
        if (!formData.nombre.trim()) {
            setMessage({ type: 'error', text: 'El nombre es obligatorio' });
            setIsSubmitting(false);
            return;
        }

        if (formData.tipo_entidad === 'local' && (!formData.calle.trim() || !formData.ciudad.trim())) {
            setMessage({ type: 'error', text: 'La dirección (calle y ciudad) es obligatoria para locales' });
            setIsSubmitting(false);
            return;
        }

        try {
            const entidadData = {
                nombre: formData.nombre.trim(),
                tipo_entidad: formData.tipo_entidad,
                descripcion: formData.descripcion.trim(),
                calle: formData.calle.trim(),
                numero: formData.numero.trim(),
                ciudad: formData.ciudad.trim(),
                codigo_postal: formData.codigo_postal.trim(),
                provincia: formData.provincia.trim(),
                avatar_url: formData.avatar_url,
                banner_url: formData.banner_url,
                usuario_id: user.id
            };

            if (isEditing) {
                // Validación extra: Verificar permisos via relaciones_entidades podría ser necesario
                // pero por RLS de Supabase debería bastar si están bien configuradas.
                // Como workaround seguro, hacemos el update directo por ID.
                const { error } = await supabase
                    .from('entidades')
                    .update(entidadData)
                    .eq('id', id);

                if (error) throw error;
                setMessage({ type: 'success', text: 'Ficha actualizada correctamente' });
            } else {
                // 1. Crear Entidad
                const { data: nuevaEntidad, error: errorEntidad } = await supabase
                    .from('entidades')
                    .insert([entidadData])
                    .select()
                    .single();

                if (errorEntidad) throw errorEntidad;

                // 2. Crear Relación (Propietario)
                const { error: errorRelacion } = await supabase
                    .from('relaciones_entidades')
                    .insert([{
                        entidad_id: nuevaEntidad.id,
                        usuario_id: user.id,
                        rol: 'admin'
                    }]);

                if (errorRelacion) {
                    console.error('Error creando relación:', errorRelacion);
                }

                // 3. Subir redes sociales si hay locales
                const pendingSocials = socials.filter(s => s.isPending);
                if (pendingSocials.length > 0) {
                    const redesParaInsertar = pendingSocials.map(s => ({
                        propietario_id: nuevaEntidad.id,
                        tipo_propietario: 'entidad',
                        tipo_red: s.tipo_red,
                        url: s.url
                    }));
                    const { error: errorRedes } = await supabase
                        .from('redes_sociales')
                        .insert(redesParaInsertar);
                    if (errorRedes) console.error('Error guardando redes pendientes:', errorRedes);
                }

                // 4. Subir imágenes pendientes si las hay
                if (pendingGallery.length > 0) {
                    const imagenesParaInsertar = pendingGallery.map(img => ({
                        entidad_id: nuevaEntidad.id,
                        url: img.url,
                        is_main: img.url === formData.banner_url
                    }));

                    const { error: errorGaleria } = await supabase
                        .from('imagenes_entidad')
                        .insert(imagenesParaInsertar);

                    if (errorGaleria) console.error('Error guardando galería pendiente:', errorGaleria);
                }

                setMessage({ type: 'success', text: 'Entidad creada correctamente' });
            }

            setTimeout(() => navigate('/RegistroPromotor'), 1500);
        } catch (error) {
            console.error('Error guardando entidad:', error);
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTipoIcon = () => {
        switch (formData.tipo_entidad) {
            case 'local': return <FaStore size={24} />;
            case 'actividad': return <FaTheaterMasks size={24} />;
            case 'amenizador': return <FaMusic size={24} />;
            default: return <FaStore size={24} />;
        }
    };

    const getSocialIcon = (tipo) => {
        switch (tipo) {
            case 'instagram': return <FaInstagram className="text-pink-600" />;
            case 'facebook': return <FaFacebook className="text-blue-600" />;
            case 'tiktok': return <FaTiktok className="text-black dark:text-white" />;
            case 'twitter': return <FaTwitter className="text-blue-400" />;
            case 'youtube': return <FaYoutube className="text-red-600" />;
            default: return <FaGlobe className="text-gray-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8">
                <div className="bg-white dark:bg-gray-800 rounded-mo shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Header del Formulario */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <button
                            onClick={() => navigate('/RegistroPromotor')}
                            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <FaArrowLeft size={16} className="text-mo-muted" />
                        </button>
                        <h1 className="font-display text-2xl font-bold text-mo-text dark:text-white">
                            {isEditing ? 'Editar Ficha' : 'Nueva Entidad'}
                        </h1>
                    </div>

                    {/* Mensaje de Feedback */}
                    {message.text && (
                        <div className={`m-6 p-4 rounded-mo font-ui text-center text-sm font-bold shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">



                        {/* ... (Datos Básicos y Descripción se mantienen igual, using original lines 433-553 inferred) ... */}
                        {/* Since I cannot jump over lines in replace_file_content without context, I will target the specific blocks. 
                            This tool call addresses the Identidad Visual block only. 
                            I'll do the Gallery block in a separate chunk in the same call if possible or separate call.
                            Actually, replace_file_content is single block. I will use multi_replace for both locations.
                         */}

                        {/* DATOS BÁSICOS */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui"
                                    placeholder="Ej: Terraza del Sol, DJ Luna..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Tipo de Entidad</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, tipo_entidad: 'local' })}
                                        className={`p-3 rounded-mo border-2 transition-all flex flex-col items-center gap-1 ${formData.tipo_entidad === 'local' ? 'border-mo-sage bg-mo-sage/5 text-mo-sage shadow-inner' : 'border-gray-100 dark:border-gray-800 opacity-50'}`}
                                    >
                                        <FaStore size={18} />
                                        <span className="text-[10px] font-bold uppercase">Local</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, tipo_entidad: 'actividad' })}
                                        className={`p-3 rounded-mo border-2 transition-all flex flex-col items-center gap-1 ${formData.tipo_entidad === 'actividad' ? 'border-mo-sage bg-mo-sage/5 text-mo-sage shadow-inner' : 'border-gray-100 dark:border-gray-800 opacity-50'}`}
                                    >
                                        <FaTheaterMasks size={18} />
                                        <span className="text-[10px] font-bold uppercase">Actividad</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, tipo_entidad: 'amenizador' })}
                                        className={`p-3 rounded-mo border-2 transition-all flex flex-col items-center gap-1 ${formData.tipo_entidad === 'amenizador' ? 'border-mo-sage bg-mo-sage/5 text-mo-sage shadow-inner' : 'border-gray-100 dark:border-gray-800 opacity-50'}`}
                                    >
                                        <FaMusic size={18} />
                                        <span className="text-[10px] font-bold uppercase">Artista</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui resize-none"
                                    placeholder="Cuéntanos más sobre esta entidad..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Dirección {formData.tipo_entidad === 'local' && '*'}</label>

                                <div className="grid grid-cols-12 gap-3 mb-3">
                                    {/* Calle */}
                                    <div className="col-span-9">
                                        <input
                                            type="text"
                                            name="calle"
                                            value={formData.calle}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui"
                                            placeholder="Calle / Avenida / Plaza"
                                            required={formData.tipo_entidad === 'local'}
                                        />
                                    </div>
                                    {/* Número */}
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            name="numero"
                                            value={formData.numero}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui"
                                            placeholder="Nº"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {/* Población */}
                                    <div>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui"
                                            placeholder="Población"
                                            required={formData.tipo_entidad === 'local'}
                                        />
                                    </div>
                                    {/* CP */}
                                    <div>
                                        <input
                                            type="text"
                                            name="codigo_postal"
                                            value={formData.codigo_postal}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui"
                                            placeholder="C. Postal"
                                        />
                                    </div>
                                    {/* Provincia */}
                                    <div>
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={formData.provincia}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-mo-sage rounded-mo outline-none text-mo-text dark:text-white transition-all font-ui"
                                            placeholder="Provincia"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN DE IMÁGENES (AL FINAL) */}
                        {/* LOGOTIPO */}
                        <div className="pt-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
                            <label className="block text-xs uppercase tracking-widest font-black text-mo-muted">
                                Logotipo de la Entidad
                            </label>
                            <div className="flex items-center gap-6">
                                <div
                                    onClick={() => document.getElementById('avatar-input').click()}
                                    className="w-44 h-28 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-mo-sage transition-all group relative p-2 shadow-sm"
                                >
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-mo-muted text-center p-2">
                                            <FaCamera size={24} className="mb-2 opacity-50" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Subir Logotipo</span>
                                            <span className="text-[7px] lowercase font-normal opacity-60">(Vertical u Horizontal)</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaPlus className="text-white" size={24} />
                                    </div>
                                </div>
                                <input id="avatar-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'avatar_url')} />
                                <p className="text-[10px] text-mo-muted italic flex-1">
                                    * El logo se adaptará automáticamente al espacio. Se recomienda un fondo transparente o sólido para mejor integración.
                                </p>
                            </div>
                        </div>

                        {/* GALERÍA DE IMÁGENES */}
                        <div className="pt-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-end">
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted">
                                    Galería de Imágenes <span className="text-[10px] font-normal normal-case opacity-70">({(gallery.length + pendingGallery.length)}/5)</span>
                                </label>
                                {(gallery.length + pendingGallery.length) >= 5 && (
                                    <span className="text-[10px] text-red-500 font-bold">Límite alcanzado</span>
                                )}
                            </div>

                            {/* Upload Button */}
                            <div className="flex gap-4 items-center">
                                <label className={`cursor-pointer px-4 py-2 bg-mo-sage/10 text-mo-sage rounded-full font-bold text-xs hover:bg-mo-sage/20 transition-colors flex items-center gap-2 ${(gallery.length + pendingGallery.length) >= 5 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                                    <FaCamera />
                                    <span>Añadir Fotos</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleGalleryUpload}
                                        disabled={uploadingImage || (gallery.length + pendingGallery.length) >= 5}
                                    />
                                </label>
                                {uploadingImage && <span className="text-xs text-mo-muted animate-pulse">Procesando...</span>}
                            </div>

                            {/* Gallery Grid (Existing + Pending) */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                {(isEditing ? gallery : []).concat(pendingGallery).map(img => {
                                    const isMain = img.url === formData.banner_url;
                                    return (
                                        <div key={img.id} className={`relative group aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100 ${isMain ? 'ring-4 ring-mo-sage scale-[1.02]' : ''}`}>
                                            <img src={img.url} alt="Galeria" className="w-full h-full object-cover" />

                                            {/* Actions Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetMainImage(img.url)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isMain ? 'bg-mo-sage text-white' : 'bg-white/20 text-white hover:bg-mo-sage'}`}
                                                >
                                                    {isMain ? 'Principal' : 'Hacer Principal'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(img.id, img.isPending)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>

                                            {/* Indicators */}
                                            {isMain && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-mo-sage text-white text-[8px] rounded uppercase font-bold backdrop-blur-sm shadow-sm">
                                                    Portada
                                                </div>
                                            )}
                                            {img.isPending && (
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-[8px] rounded uppercase font-bold backdrop-blur-sm">
                                                    Pendiente
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Placeholder Slots to show limit */}
                                {[...Array(Math.max(0, 5 - ((isEditing ? gallery.length : 0) + pendingGallery.length)))].map((_, i) => (
                                    <div key={`placeholder-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-50">
                                        <span className="text-2xl text-gray-200 dark:text-gray-700">+</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[10px] text-mo-muted italic text-center">
                                * Selecciona una imagen como <span className="font-bold text-mo-sage">Principal</span> para usarla de portada.
                            </p>
                        </div>

                        {/* REDES SOCIALES - SOLO VISIBLE SI ESTAMOS EDITANDO */}
                        {isEditing ? (
                            <div className="pt-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
                                <label className="block text-xs uppercase tracking-widest font-black text-mo-muted mb-2">Presencia Digital</label>

                                {/* Lista de redes existentes */}
                                <div className="space-y-3 mb-4">
                                    {socials.map(social => (
                                        <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-mo border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xl">{getSocialIcon(social.tipo_red)}</div>
                                                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm text-mo-text dark:text-white hover:underline truncate max-w-[200px]">
                                                    {social.url}
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSocial(social.id)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {socials.length === 0 && (
                                        <p className="text-sm text-center text-mo-muted italic">No hay redes sociales añadidas.</p>
                                    )}
                                </div>

                                {/* Formulario añadir red */}
                                <div className="flex gap-2 items-end p-4 bg-mo-sage/5 rounded-mo border border-mo-sage/10">
                                    <div className="w-1/3">
                                        <label className="text-[10px] font-bold uppercase text-mo-muted mb-1 block">Red</label>
                                        <select
                                            value={newSocial.tipo}
                                            onChange={(e) => setNewSocial({ ...newSocial, tipo: e.target.value })}
                                            className="w-full p-3 bg-white dark:bg-gray-800 rounded-mo border border-gray-200 dark:border-gray-700 text-sm outline-none"
                                        >
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="twitter">X (Twitter)</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="website">Web / Otra</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase text-mo-muted mb-1 block">Enlace (URL)</label>
                                        <input
                                            type="url"
                                            value={newSocial.url}
                                            onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full p-3 bg-white dark:bg-gray-800 rounded-mo border border-gray-200 dark:border-gray-700 text-sm outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddSocial}
                                        className="p-3 bg-mo-sage text-white rounded-mo shadow-md hover:bg-mo-olive transition-colors"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-mo text-sm text-center">
                                <p>ℹ️ Guarda la entidad primero para poder añadir redes sociales.</p>
                            </div>
                        )}

                        {/* BOTÓN GUARDAR */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-mo-olive hover:bg-mo-olive/90 text-white rounded-mo font-bold text-lg shadow-mo-soft active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <FaSave size={20} />
                                {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Ficha' : 'Crear Entidad')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EntidadForm;
