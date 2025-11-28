// src/pages/Agenda.jsx
import { useState, useEffect, useMemo } from 'react'; 
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 
import './Agenda.css'; 

// === RUTA DEL ICONO ZAMBOMBA ===
const ZAMBOMBA_ICON_PATH = '/Assets/Icon_Zambomba.png'; 

// CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://grehdbulpfgtphrvemup.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NY3z8RN2s1lH3d4qV6JsMg_cPuTnehx';

// ANUNCIOS FIJOS - SERVICIOS PÚBLICOS
const anunciosFijos = [
    { 
        id: 'anuncio1', 
        header_titulo: '🚌 SERVICIO ESPECIAL LANZADERA ZAMBOMBAS 2025 🚌',
        titulo: 'Zona NORTE: RECORRIDO 1: EXPLANADA ATRACCIONES FERIA → ALAMEDA CRISTINA\nZona Sur: RECORRIDO 2: PARKING ESTADIO PEDRO S. GARRIDO → ALCÁZAR', 
        descripcion: 'El servicio está operativo los Viernes, Sábados, y víspera de Festivos, desde el 21 de noviembre hasta el 20 de diciembre.', 
        tipo: 'anuncio_fijo',
        organizador: 'Ayuntamiento de Jerez'
    },
    { 
        id: 'anuncio2', 
        header_titulo: '🚻 ASEOS PÚBLICOS CON MÓDULO P.M.R. ♿',
        titulo: 'Ubicaciones de baños portátiles', 
        descripcion: '• Plaza Belén\n• Plaza Estévez\n• Alameda del Banco\n\ Estos baños portátiles serán móviles, es decir, se desplazarán en función de las necesidades de cada jornada, ajustándose a la afluencia de público o la celebración de zambombas específicas.', 
        tipo: 'anuncio_fijo',
        organizador: 'Ayuntamiento de Jerez'
    }
];

// El link de los demos ahora es '/'
const eventosDemo = [
    { 
        id: 'demo1', 
        header_titulo: 'TUS KEDADAS',
        titulo: '¿Organizas quedadas? Publícalas aquí', 
        descripcion: 'Aquí puedes poner la quedada de tu grupo para que se unan más personas. Especifica lugar, hora y actividad. Comparte WhatsApp del grupo para coordinar. Perfecto para tardeos, rutas o excursiones. Lo notificaremos a tus seguidores. ', 
        imagen: '🎉', 
        link: '/', 
        esDemo: true
    },
    { 
        id: 'demo2', 
        header_titulo: 'BARES, PUBS, SALAS',
        titulo: '¿Organizas algo especial hoy? Publícalas aquí', 
        descripcion: 'Aquí puedes promocionar tus happy hours, tapas, menús especiales. Añade foto, horarios y precios. Los usuarios podrán contactarte por WhatsApp, llamada o web. Lo notificaremos a tus seguidores.', 
        imagen: '🎨', 
        link: '/', 
        esDemo: true
    },
    { 
        id: 'demo3', 
        header_titulo: 'TU GRUPO DE AMIGOS',
        titulo: 'Crea tu comunidad en EstaNoche.es', 
        descripcion: 'Organiza eventos recurrentes y construye comunidad. Quedadas semanales, clubs, grupos de interés. Los usuarios se unen fácilmente. Lo notificaremos a tus seguidores. ', 
        imagen: '👥', 
        link: '/', 
        esDemo: true
    },
    { 
        id: 'demo4', 
        header_titulo: 'TU ACTUACIÓN',
        titulo: '¿Actúas? Anuncia tu próximo concierto', 
        descripcion: 'Publica detalles: dónde actúas, qué día, precio de entrada. Añade cartel del evento o foto del grupo. Conecta con tu público y salas. Lo notificaremos a tus seguidores.', 
        imagen: '🎸', 
        link: '/', 
        esDemo: true
    },
    { 
        id: 'demo5', 
        header_titulo: 'SIGUE A TUS FAVORITOS',
        titulo: 'Te gustaría estar al día de tus eventos favoritos?', 
        descripcion: 'Si sigues a alguno de los organizadores o intérpretes, cada vez que estén en un evento, te llegará una notificación.', 
        imagen: '📣', 
        link: '/', 
        esDemo: true
    }
];

// LLAMADA A SUPABASE
const fetchZambombas = async () => {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/zambombas_2025?select=*`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error cargando zambombas:', error);
        return [];
    }
};

// COMPONENTE PRINCIPAL
function Agenda() {
    const [zambombas, setZambombas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('Hoy'); // Por defecto "Hoy"

    useEffect(() => {
        const cargarZambombas = async () => {
            setLoading(true);
            const eventos = await fetchZambombas();
            setZambombas(eventos);
            setLoading(false);
        };
        cargarZambombas();
    }, []);

    // 1. FILTRAR Y ORDENAR - LÓGICA CORREGIDA
    const zambombasFiltradas = useMemo(() => {
        const now = new Date();
        
        // Fechas para los filtros
        const hoyInicio = new Date(now);
        hoyInicio.setHours(0, 0, 0, 0);
        
        const hoyFin = new Date(now);
        hoyFin.setHours(23, 59, 59, 999);
        
        const unaSemana = new Date(now);
        unaSemana.setDate(now.getDate() + 7);
        unaSemana.setHours(23, 59, 59, 999);

        // Primero filtramos eventos que NO han terminado (usando hora_fin)
        const eventosNoTerminados = zambombas.filter(evento => {
            try {
                // Para determinar si el evento terminó: nos fijamos en hora_fin
                const eventEnd = evento.hora_fin ? 
                    new Date(`${evento.fecha_evento}T${evento.hora_fin}`) : 
                    // Si no hay hora_fin, asumimos que termina al final del día
                    new Date(`${evento.fecha_evento}T23:59:59`);
                
                // Solo incluir eventos que NO han terminado
                return eventEnd > now;
            } catch (e) {
                return false; // Excluir eventos con fechas inválidas
            }
        });

        // Lógica de ordenación por fecha y hora de INICIO (para mostrar)
        const sorted = eventosNoTerminados.sort((a, b) => {
            const dateA = new Date(`${a.fecha_evento}T${a.hora_evento || '00:00'}`);
            const dateB = new Date(`${b.fecha_evento}T${b.hora_evento || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });

        // Aplicar filtros específicos (basados en fecha de INICIO)
        return sorted.filter(evento => {
            const eventStart = new Date(`${evento.fecha_evento}T${evento.hora_evento || '00:00'}`);
            
            if (isNaN(eventStart.getTime())) return false;

            if (filtro === 'Hoy') {
                // Eventos que INICIAN hoy
                return eventStart >= hoyInicio && eventStart <= hoyFin;
            }

            if (filtro === 'Semana') {
                // Eventos que INICIAN esta semana
                return eventStart >= hoyInicio && eventStart <= unaSemana;
            }

            if (filtro === 'Todos') {
                // Todos los eventos NO TERMINADOS (ya filtrados arriba)
                return true;
            }
            
            return true;
        });
    }, [zambombas, filtro]);

    // 2. INTERCALAR Y CICLAR EVENTOS DEMO CADA 5 ZAMBOMBAS
    const eventosMezclados = useMemo(() => {
        const resultado = [];
        let insertionCount = 0;
        const demoCount = eventosDemo.length;
        
        for (let i = 0; i < zambombasFiltradas.length; i++) {
            resultado.push({ ...zambombasFiltradas[i], tipo: 'zambomba' });
            
            if ((i + 1) % 5 === 0) {
                const demoIndex = insertionCount % demoCount; 
                resultado.push({ ...eventosDemo[demoIndex], tipo: 'demo' });
                insertionCount++; 
            }
        }
        return resultado;
    }, [zambombasFiltradas]);

    // 3. AÑADIR ANUNCIOS FIJOS AL PRINCIPIO
    const eventosConAnuncios = useMemo(() => {
        if (zambombasFiltradas.length === 0) {
            return [];
        }
        return [...anunciosFijos, ...eventosMezclados];
    }, [eventosMezclados, zambombasFiltradas]);
    

    return (
        <div style={{
            minHeight: '100vh',
            background: '#3C3C8A', 
            paddingTop: '4.5rem' 
        }}>
            <Header /> 

            <div className="contenido-principal">
                
                {/* DISCRIMINADOR/FILTRO HOY / SEMANA / TODOS */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '1.5rem', 
                    padding: '0 1rem' 
                }}>
                    {['Hoy', 'Semana', 'Todos'].map((opcion) => (
                        <button
                            key={opcion}
                            onClick={() => setFiltro(opcion)}
                            style={{
                                padding: '8px 15px',
                                borderRadius: '9999px',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                backgroundColor: filtro === opcion ? '#FFB703' : 'white',
                                color: filtro === opcion ? '#3C3C8A' : '#4a5568',
                                border: '2px solid #FFB703',
                                transition: 'all 0.2s',
                                boxShadow: filtro === opcion ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            {opcion}
                        </button>
                    ))}
                </div>

                <div className="lista-eventos">
                    {loading ? (
                        <div className="text-center py-12 evento-caja" style={{ background: 'white', borderRadius: '12px' }}> 
                            <div className="text-6xl mb-4">⏳</div>
                            <h3 style={{ color: '#2d3748' }} className="text-xl font-semibold mb-2">Cargando eventos...</h3>
                        </div>
                    ) : eventosConAnuncios.length === 0 ? (
                        <div className="text-center py-12 evento-caja" style={{ background: 'white', borderRadius: '12px' }}>
                            <div className="text-6xl mb-4">😔</div>
                            <h3 style={{ color: '#2d3748' }} className="text-xl font-semibold mb-2">No hay eventos</h3>
                            <p style={{ color: '#4a5568' }} className="mb-4">No hay eventos para la selección <strong>{filtro}</strong>.</p>
                            {/* Botón de fallback redirige a inicio */}
                            <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                                🚀 Volver a inicio
                            </a>
                        </div>
                    ) : (
                        eventosConAnuncios.map((evento, index) => {
                            
                            // PLANTILLA PARA ANUNCIOS FIJOS - SERVICIOS PÚBLICOS
                            if (evento.tipo === 'anuncio_fijo') {
                                return (
                                    <div 
                                        key={evento.id} 
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: '1.5rem 1rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                            background: 'linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 100%)',
                                            color: '#01579B',
                                            textAlign: 'center',
                                            marginBottom: '1rem',
                                            border: '2px solid #0288D1'
                                        }}
                                    >
                                        {/* Cabecera */}
                                        <div style={{ 
                                            fontSize: '1.4rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '1rem', 
                                            paddingBottom: '0.5rem',
                                            borderBottom: '2px solid #0288D1', 
                                            width: '100%',
                                            textAlign: 'center'
                                        }}>
                                            {evento.header_titulo}
                                        </div>

                                        {/* Título con saltos de línea */}
                                        <div style={{ 
                                            fontSize: '1.3rem', 
                                            fontWeight: '700', 
                                            marginBottom: '1rem', 
                                            lineHeight: '1.4',
                                            color: '#0277BD',
                                            whiteSpace: 'pre-line'
                                        }}>
                                            {evento.titulo}
                                        </div>
                                        
                                        {/* Descripción con saltos de línea */}
                                        <div style={{ 
                                            fontSize: '1.1rem', 
                                            marginBottom: '1.5rem', 
                                            lineHeight: '1.6',
                                            textAlign: 'center',
                                            whiteSpace: 'pre-line'
                                        }}>
                                            {evento.descripcion}
                                        </div>

                                        {/* Organizador */}
                                        <div style={{ 
                                            display: 'inline-block',
                                            background: '#0288D1', 
                                            color: 'white', 
                                            padding: '8px 16px', 
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                                            {evento.organizador}
                                        </div>
                                    </div>
                                );
                            }

                            // PLANTILLA DE EVENTOS DEMO
                            if (evento.tipo === 'demo') {
                                return (
                                    <a 
                                        key={evento.id + '-' + index} 
                                        href={evento.link || '/'} // Redirige a inicio
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: '1.5rem 1rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                            background: 'linear-gradient(135deg, #FFB703 0%, #F72585 100%)',
                                            color: 'white',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            cursor: 'pointer'
                                        }}
                                        className="evento-caja-demo"
                                    >
                                        {/* Cabecera: Icono + Texto en una sola línea (más grande) */}
                                        <div style={{ 
                                            fontSize: '1.75rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '1rem', 
                                            paddingBottom: '0.5rem',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.4)', 
                                            width: '100%',
                                            textAlign: 'center'
                                        }}>
                                            {evento.imagen} {evento.header_titulo} 
                                        </div>

                                        {/* Título (Contenido principal del anuncio) */}
                                        <div style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.25rem', lineHeight: '1.2' }}>
                                            {evento.titulo}
                                        </div>
                                        
                                        {/* Descripción (Font size 1.5rem) */}
                                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem', opacity: 0.9 }}>
                                            {evento.descripcion}
                                        </div>

                                        {/* Etiqueta promocional con degradado y texto "EstaNoche.es" */}
                                        <span style={{ 
                                            display: 'inline-block',
                                            background: 'linear-gradient(90deg, #F72585, #FFB703)', 
                                            color: 'white', 
                                            padding: '8px 16px', 
                                            borderRadius: '9999px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            border: '2px solid white' 
                                        }}>
                                            ESTANOCHE.ES
                                        </span>
                                    </a>
                                );
                            }

                            // --- LÓGICA PARA EVENTOS OFICIALES (ZAMBOMBAS) ---
                            const creador = evento.organizador || evento.creador_nombre || evento.lugar || 'Organizador no especificado'; 
                            const artistas = evento.artistas;
                            const ciudad = evento.localidad || evento.ciudad || evento.provincia || 'Jerez'; 
                            const direccion = evento.direccion || evento.lugar || evento.direccion_evento;
                            
                            // 🟢 LÓGICA DE MAPAS
                            const addressDisplay = direccion || 'Sin dirección';
                            const cityDisplay = direccion && ciudad ? `, ${ciudad}` : ciudad || '';
                            const fullAddressQuery = direccion ? `${direccion} ${ciudad}` : '';
                            const mapQuery = encodeURIComponent(fullAddressQuery);
                            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
                            const hasValidAddress = !!direccion;

                            let fechaHoraStr = 'Fecha/Hora no disponible';
                            if (evento.fecha_evento && evento.hora_evento) {
                                try {
                                    const fecha = new Date(evento.fecha_evento + 'T' + evento.hora_evento);
                                    const fechaStr = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '');
                                    const horaStr = evento.hora_evento.substring(0, 5);
                                    fechaHoraStr = `${fechaStr} • ${horaStr}h`;
                                    
                                    // Añadir hora de fin si existe
                                    if (evento.hora_fin) {
                                        const horaFinStr = evento.hora_fin.substring(0, 5);
                                        fechaHoraStr += ` - ${horaFinStr}h`;
                                    }
                                } catch (e) {
                                    fechaHoraStr = 'Fecha/Hora Inválida';
                                }
                            }
                            
                            const amenizanTexto = artistas ? artistas : 'Grupo propio';
                            const tipoEventoStr = 'Zambomba';


                            return (
                                <div 
                                    key={evento.id} 
                                    className="evento-caja" 
                                    style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                >
                                    <div style={{ padding: '0.5rem 1rem' }}> 
                                        
                                        {/* CABECERA: Zambomba | Fecha/Hora */}
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            paddingTop: '5px', 
                                            marginBottom: '0.2rem' 
                                        }}>
                                            
                                            {/* COL 1: ICONO ZAMBOMBA + TIPO DE EVENTO */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <img 
                                                    src={ZAMBOMBA_ICON_PATH} 
                                                    alt="Icono Zambomba" 
                                                    style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                                                />
                                                <span style={{ 
                                                    fontWeight: 'bold', 
                                                    color: '#2d3748', 
                                                    fontSize: '1.2rem' 
                                                }}>
                                                    {tipoEventoStr}
                                                </span>
                                            </div>
                                            
                                            {/* COL 2: FECHA Y HORA (Derecha con espaciado) */}
                                            <div style={{ 
                                                fontWeight: 'bold', 
                                                color: '#4c51bf', 
                                                fontSize: '1.4rem', 
                                                paddingRight: '15px' 
                                            }}>
                                                {fechaHoraStr}
                                            </div>
                                        </div>

                                        {/* CONVOCANTE/ORGANIZADOR */}
                                        <h1 style={{ 
                                            fontSize: '1.75rem', 
                                            fontWeight: '900', 
                                            color: '#2d3748', 
                                            textAlign: 'center',
                                            marginBottom: '1.0rem' 
                                        }}>
                                            {creador}
                                        </h1>

                                        {/* ARTISTAS (AMENIZAN) */}
                                        <div style={{ textAlign: 'center', 
                                            marginBottom: '1rem' 
                                        }}>
                                            <span style={{ 
                                                fontSize: '1.5rem', 
                                                fontWeight: '500', 
                                                color: '#4a5568' 
                                            }}>
                                                Amenizan:
                                                <strong style={{ fontWeight: 'bold' }}>
                                                    {' '}{amenizanTexto}
                                                </strong>
                                            </span>
                                        </div>
                                        
                                        {/* UBICACIÓN */}
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ 
                                                fontSize: '1.5rem', 
                                                fontWeight: 'normal', 
                                                color: '#4a5568', 
                                                marginBottom: '0',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                lineHeight: '1.2'
                                            }}>
                                                {/* Texto de la Dirección y Ciudad */}
                                                <span>
                                                    {addressDisplay}
                                                    {cityDisplay}
                                                </span>
                                                
                                                {/* Icono de Google Maps */}
                                                {hasValidAddress && (
                                                    <a 
                                                        href={mapUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        title="Abrir en Google Maps"
                                                        style={{
                                                            marginLeft: '12px',
                                                            fontSize: '1.75rem', 
                                                            lineHeight: '1',
                                                            textDecoration: 'none',
                                                            color: '#4c51bf',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        📍
                                                    </a>
                                                )}
                                            </p>
                                        </div>
                                    </div> 
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Agenda;