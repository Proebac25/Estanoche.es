import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaFilter, FaMusic, FaStore } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import '../../styles/core/core-ui-v11.css';

const Agenda = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [eventos, setEventos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [entidadesDict, setEntidadesDict] = useState({});
    const [loading, setLoading] = useState(true);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [dateFilter, setDateFilter] = useState('todos'); // 'todos', 'hoy', 'finde'
    const [timeFilter, setTimeFilter] = useState(''); // '', 'tarde', 'noche'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Obtener Categorías
                const { data: cats } = await supabase
                    .from('categorias')
                    .select('id, nombre, icono_emoji');
                
                if (cats) setCategorias(cats);

                // 2. Obtener Diccionario de Entidades (para nombres de locales y artistas)
                const { data: ents } = await supabase
                    .from('entidades')
                    .select('id, nombre, tipo_entidad');
                
                if (ents) {
                    const dict = {};
                    ents.forEach(e => dict[e.id] = e.nombre);
                    setEntidadesDict(dict);
                }

                // 3. Obtener Eventos Públicos Futuros
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const { data: evts, error } = await supabase
                    .from('eventos')
                    .select('*')
                    .eq('visibilidad', 'publico')
                    .gte('fecha_inicio', today.toISOString())
                    .order('fecha_inicio', { ascending: true });

                if (error) {
                    console.error('Error cargando eventos:', error);
                } else {
                    setEventos(evts || []);
                }
            } catch (err) {
                console.error('Excepción al cargar datos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helpers de Fecha
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        return new Date(isoString).toLocaleDateString('es-ES', options).toUpperCase();
    };

    const getMesInfo = (isoString) => {
        if (!isoString) return { dia: '', mes: '' };
        const d = new Date(isoString);
        return {
            dia: d.getDate(),
            mes: d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
        };
    };

    const isFinde = (date) => {
        const day = date.getDay();
        return day === 5 || day === 6 || day === 0; // Viernes, Sábado, Domingo
    };

    // Lógica de Filtrado
    const getFilteredEvents = () => {
        let filtered = [...eventos];

        // Texto (Local, Localidad, Palabra clave)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(e => 
                (e.titulo && e.titulo.toLowerCase().includes(lowerSearch)) ||
                (e.localidad && e.localidad.toLowerCase().includes(lowerSearch)) ||
                (e.ubicacion && e.ubicacion.toLowerCase().includes(lowerSearch)) ||
                (e.lugar_manual && e.lugar_manual.toLowerCase().includes(lowerSearch)) ||
                (e.amenizador && e.amenizador.toLowerCase().includes(lowerSearch))
            );
        }

        // Provincia
        if (selectedProvincia) {
            filtered = filtered.filter(e => e.provincia === selectedProvincia);
        }

        // Fecha
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'hoy') {
            filtered = filtered.filter(e => {
                const eventDate = new Date(e.fecha_inicio);
                return eventDate.toDateString() === today.toDateString();
            });
        } else if (dateFilter === 'finde') {
            filtered = filtered.filter(e => {
                const eventDate = new Date(e.fecha_inicio);
                return eventDate >= today && isFinde(eventDate);
            });
        }

        // Horario
        if (timeFilter) {
            filtered = filtered.filter(e => {
                const eventDate = new Date(e.fecha_inicio);
                const hours = eventDate.getHours();
                if (timeFilter === 'tarde') return hours >= 13 && hours < 20; // 13:00 a 19:59
                if (timeFilter === 'noche') return hours >= 20 || hours < 6;  // 20:00 a 05:59
                return true;
            });
        }

        return filtered;
    };

    const filteredEvents = getFilteredEvents();

    // Obtener provincias únicas para el selector
    const provinciasUnicas = [...new Set(eventos.map(e => e.provincia).filter(Boolean))].sort();

    const getCategoriaName = (id) => {
        const cat = categorias.find(c => c.id === id);
        return cat ? cat.nombre : 'Evento';
    };

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
                
                {/* HERO AGENDA */}
                <div className="mb-10 md:mb-16 text-center space-y-4">
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-mo-text dark:text-white tracking-tight">
                        La Agenda de <span className="text-transparent bg-clip-text bg-gradient-to-r from-mo-sage to-mo-olive">Ocio</span>
                    </h1>
                    <p className="text-mo-muted dark:text-gray-400 font-ui text-sm md:text-lg max-w-2xl mx-auto">
                        Descubre los mejores eventos, fiestas y conciertos cerca de ti. La noche te espera.
                    </p>
                </div>

                {/* FILTROS */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-[2rem] shadow-mo-soft border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row flex-wrap gap-4 items-center">
                    
                    {/* Selector Provincia */}
                    <div className="relative w-full md:w-48">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                        <select 
                            value={selectedProvincia}
                            onChange={(e) => setSelectedProvincia(e.target.value)}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-mo-sage/30 text-sm font-bold dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="">Provincia...</option>
                            {provinciasUnicas.map(prov => (
                                <option key={prov} value={prov}>{prov}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                    </div>

                    {/* Buscador (Local, Localidad, Palabra clave) */}
                    <div className="relative w-full md:flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar local, localidad o palabra clave..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-mo-sage/30 text-sm dark:text-white transition-all"
                        />
                    </div>

                    {/* Selector Horario */}
                    <div className="relative w-full md:w-40">
                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                        <select 
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-mo-sage/30 text-sm font-bold dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="">Cualquier hora</option>
                            <option value="tarde">Tarde (13:00 - 20:00)</option>
                            <option value="noche">Noche (a partir 20:00)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                    </div>

                    {/* Botones de Fecha */}
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar mt-2 md:mt-0">
                        <button 
                            onClick={() => setDateFilter('todos')}
                            className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${dateFilter === 'todos' ? 'bg-mo-text text-white dark:bg-white dark:text-gray-900 shadow-md' : 'bg-gray-50 text-mo-muted hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700'}`}
                        >
                            <FaCalendarAlt size={12} /> Próximos
                        </button>
                        <button 
                            onClick={() => setDateFilter('hoy')}
                            className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${dateFilter === 'hoy' ? 'bg-mo-sage text-white shadow-md' : 'bg-gray-50 text-mo-muted hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700'}`}
                        >
                            Hoy
                        </button>
                        <button 
                            onClick={() => setDateFilter('finde')}
                            className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${dateFilter === 'finde' ? 'bg-mo-olive text-white shadow-md' : 'bg-gray-50 text-mo-muted hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700'}`}
                        >
                            Este Finde
                        </button>
                    </div>
                </div>

                {/* GRID DE EVENTOS */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-mo-muted">
                        <div className="w-12 h-12 border-4 border-mo-sage border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold tracking-widest uppercase text-sm">Buscando planes...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700">
                        <FaFilter size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="font-display font-bold text-xl mb-2 text-mo-text dark:text-white">No hay eventos a la vista</h3>
                        <p className="text-mo-muted">Prueba a cambiar los filtros o buscar en otra ciudad.</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setSelectedProvincia(''); setDateFilter('todos');}}
                            className="mt-6 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-sm text-mo-text dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(evento => {
                            const mesInfo = getMesInfo(evento.fecha_inicio);
                            const localName = evento.lugar_manual || entidadesDict[evento.entidad_local_id] || '';
                            const amenizadorName = evento.amenizador || entidadesDict[evento.entidad_amenizador_id] || '';
                            
                            return (
                                <div 
                                    key={evento.id} 
                                    onClick={() => navigate(`/evento/${evento.id}`)}
                                    className="group bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-mo-soft border border-gray-100 dark:border-gray-700 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
                                >
                                    {/* Imagen Destacada */}
                                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                        {evento.imagen_url ? (
                                            <img 
                                                src={evento.imagen_url} 
                                                alt={evento.titulo} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-mo-sage/20 to-mo-olive/20 flex items-center justify-center">
                                                <FaTicketAlt size={48} className="text-mo-sage/40" />
                                            </div>
                                        )}
                                        
                                        {/* Overlay oscuro en la parte inferior */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60"></div>
                                        
                                        {/* Badge de Categoría */}
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-bold text-white border border-white/20">
                                            {getCategoriaName(evento.categoria_id)}
                                        </div>

                                        {/* Badge Flotante de Fecha */}
                                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-14 h-16 flex flex-col items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700">
                                            <div className="bg-mo-sage text-white text-[9px] uppercase tracking-widest font-bold w-full text-center py-1">
                                                {mesInfo.mes}
                                            </div>
                                            <div className="font-display font-black text-xl text-mo-text dark:text-white leading-none mt-1">
                                                {mesInfo.dia}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info del Evento */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="font-display font-bold text-xl text-mo-text dark:text-white line-clamp-2 leading-tight group-hover:text-mo-sage transition-colors">
                                                    {evento.titulo}
                                                </h3>
                                                {amenizadorName && (
                                                    <p className="text-xs text-mo-muted dark:text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                                        <FaMusic className="text-mo-sage" /> {amenizadorName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-auto">
                                            <div className="flex items-center gap-2 text-xs text-mo-muted dark:text-gray-400 font-bold uppercase tracking-wide">
                                                <FaCalendarAlt size={12} className="text-mo-sage" />
                                                <span>{formatDate(evento.fecha_inicio)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                                                <FaMapMarkerAlt size={12} className="text-mo-olive flex-shrink-0" />
                                                <span className="truncate">
                                                    {evento.provincia} · {evento.localidad} {localName && `· ${localName}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Footer Tarjeta */}
                                    <div className="px-6 py-4 border-t border-gray-50 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                        <span className="text-sm font-black text-mo-text dark:text-white bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
                                            {evento.precio_actual || 'Consultar'}
                                        </span>
                                        <span className="text-xs font-bold text-mo-sage uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                            Ver Detalles →
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Agenda;
