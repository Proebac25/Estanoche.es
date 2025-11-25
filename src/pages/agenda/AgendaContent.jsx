import React, { useState, useEffect, useMemo } from 'react';
import DetalleEventoModal from './DetalleEventoModal.jsx';
import PerfilCreadorModal from './PerfilCreadorModal.jsx';

// ==================== DATOS ESTÁTICOS PUBLICITARIOS ====================
const ciudadesData = {
  jerez: { id: 'jerez', nombre: 'Jerez', nombreCompleto: 'Jerez de la Frontera', cercanas: ['cadiz', 'puerto'] },
  cadiz: { id: 'cadiz', nombre: 'Cádiz', nombreCompleto: 'Cádiz', cercanas: ['jerez', 'puerto'] },
  puerto: { id: 'puerto', nombre: 'El Puerto', nombreCompleto: 'El Puerto de Santa María', cercanas: ['jerez', 'cadiz'] }
};

const perfiles = {
  ejemplo_bar: { id: 'ejemplo_bar', nombre: 'Tu Bar Aquí', tipo: 'local_fijo', ciudad: 'jerez', descripcion: '¿Tienes un bar? Promociona tus eventos y ofertas aquí.', imagen: '🍺', telefono: '+34 900 000 000', instagram: '@tubar', web: 'www.tubar.com', esPublicidad: true },
  ejemplo_musico: { id: 'ejemplo_musico', nombre: 'Tu Grupo Musical', tipo: 'itinerante', ciudad: 'jerez', descripcion: '¿Eres músico? Publica tus conciertos aquí.', imagen: '🎸', instagram: '@tugrupo', web: 'www.tugrupo.com', esPublicidad: true },
  ejemplo_grupo: { id: 'ejemplo_grupo', nombre: 'Tu Grupo de Amigos', tipo: 'itinerante', ciudad: 'jerez', descripcion: '¿Organizas quedadas? Publícalas aquí.', imagen: '🎉', whatsapp: '+34 600 000 000', esPublicidad: true },
  ejemplo_sala: { id: 'ejemplo_sala', nombre: 'Tu Sala de Conciertos', tipo: 'local_fijo', ciudad: 'cadiz', descripcion: '¿Tienes una sala? Promociona tu programación cultural.', imagen: '🎭', telefono: '+34 900 111 222', web: 'www.tusala.com', esPublicidad: true }
};

const generarFecha = (dias, hora, min) => {
  const f = new Date();
  f.setDate(f.getDate() + dias);
  f.setHours(hora, min, 0, 0);
  return f;
};

const eventos = [
  { id: 1, creadorId: 'ejemplo_bar', titulo: '¿Tienes ofertas especiales? Publícalas aquí', descripcion: 'Aquí puedes promocionar tus happy hours, tapas, menús especiales. Añade foto, horarios y precios. Los usuarios podrán contactarte por WhatsApp, llamada o web.', categoria: 'gastronomia', precio: 'Tu precio', fechaInicio: generarFecha(0, 20, 0), fechaFin: generarFecha(0, 23, 30), imagen: '🍺', esPublicidad: true },
  { id: 2, creadorId: 'ejemplo_musico', titulo: '¿Eres músico? Anuncia tu próximo concierto', descripcion: 'Publica detalles: dónde actúas, qué día, precio de entrada. Añade cartel del evento o foto del grupo. Conecta con tu público y salas.', categoria: 'musica', precio: 'Precio entrada', fechaInicio: generarFecha(1, 22, 0), fechaFin: generarFecha(2, 2, 0), imagen: '🎸', esPublicidad: true },
  { id: 3, creadorId: 'ejemplo_grupo', titulo: '¿Organizas quedadas? Publícalas aquí', descripcion: 'Aquí puedes poner la quedada de tu grupo para que se unan más personas. Especifica lugar, hora y actividad. Comparte WhatsApp del grupo para coordinar.', categoria: 'social', precio: 'Gratis', fechaInicio: generarFecha(0, 15, 0), fechaFin: generarFecha(0, 20, 0), imagen: '🎉', esPublicidad: true },
  { id: 4, creadorId: 'ejemplo_sala', titulo: '¿Tienes una sala? Anuncia tu programación', descripcion: 'Publica tu cartelera: obras de teatro, monólogos, conciertos, espectáculos. Añade cartel, precios y enlace para entradas.', categoria: 'teatro', precio: 'Precio entrada', fechaInicio: generarFecha(2, 20, 0), fechaFin: generarFecha(2, 23, 0), imagen: '🎭', esPublicidad: true },
  { id: 5, creadorId: 'ejemplo_bar', titulo: 'Promociona tu negocio en EstaNoche', descripcion: 'Este espacio puede ser tuyo. Publica ofertas, eventos, promociones. Añade imagen profesional, horarios, ubicación y contactos.', categoria: 'gastronomia', precio: 'Consultar', fechaInicio: generarFecha(1, 13, 0), fechaFin: generarFecha(1, 17, 0), imagen: '💼', esPublicidad: true },
  { id: 6, creadorId: 'ejemplo_musico', titulo: 'Llega a tu público con EstaNoche', descripcion: 'Promociona tus eventos culturales y de ocio. Teatro, música, arte, talleres... Configura qué contactos mostrar.', categoria: 'musica', precio: 'Variable', fechaInicio: generarFecha(3, 21, 0), fechaFin: generarFecha(4, 1, 0), imagen: '🎨', esPublicidad: true },
  { id: 7, creadorId: 'ejemplo_grupo', titulo: 'Crea tu comunidad en EstaNoche', descripcion: 'Organiza eventos recurrentes y construye comunidad. Quedadas semanales, clubs, grupos de interés.', categoria: 'social', precio: 'Según evento', fechaInicio: generarFecha(0, 18, 0), fechaFin: generarFecha(0, 22, 0), imagen: '👥', esPublicidad: true }
];

// ==================== COMPONENTE PRINCIPAL ====================
export default function AgendaContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filtroHora, setFiltroHora] = useState('ahora');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('jerez');
  const [mostrarCercanas, setMostrarCercanas] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ciudad = params.get('ciudad');
    if (ciudad && ciudadesData[ciudad]) setCiudadSeleccionada(ciudad);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const categorias = [
    { id: 'todas', nombre: 'Todas', icon: '📅' },
    { id: 'musica', nombre: 'Música', icon: '🎵' },
    { id: 'gastronomia', nombre: 'Gastro', icon: '🍽️' },
    { id: 'social', nombre: 'Social', icon: '👥' },
    { id: 'teatro', nombre: 'Teatro', icon: '🎭' }
  ];

  const horasDisponibles = [
    { valor: 'ahora', label: `Ahora (${currentTime.getHours().toString().padStart(2,'0')}:${currentTime.getMinutes().toString().padStart(2,'0')})` },
    { valor: '14', label: '14:00' }, { valor: '16', label: '16:00' },
    { valor: '18', label: '18:00' }, { valor: '20', label: '20:00' },
    { valor: '22', label: '22:00' }, { valor: '0', label: '00:00' },
    { valor: '2', label: '02:00' },   { valor: '4', label: '04:00' }
  ];

  const ciudadesAMostrar = useMemo(() => {
    const ciudad = ciudadesData[ciudadSeleccionada];
    return mostrarCercanas ? [ciudadSeleccionada, ...ciudad.cercanas] : [ciudadSeleccionada];
  }, [ciudadSeleccionada, mostrarCercanas]);

  const eventosFiltrados = useMemo(() => {
    let horaFiltro = currentTime;
    if (filtroHora !== 'ahora') {
      horaFiltro = new Date();
      horaFiltro.setHours(parseInt(filtroHora), 0, 0, 0);
    }
    return eventos
      .filter(e => {
        const creador = perfiles[e.creadorId];
        if (!ciudadesAMostrar.includes(creador.ciudad)) return false;
        if (categoriaSeleccionada !== 'todas' && e.categoria !== categoriaSeleccionada) return false;
        if (e.fechaFin < horaFiltro) return false;
        return true;
      })
      .sort((a, b) => a.fechaInicio - b.fechaInicio);
  }, [ciudadesAMostrar, categoriaSeleccionada, filtroHora, currentTime]);

  const getTimeRemaining = (fechaFin) => {
    const diff = fechaFin - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (diff < 0) return { text: 'Finalizado', color: 'text-gray-500' };
    if (hours === 0) return { text: `${minutes} min`, color: 'text-red-500' };
    if (hours < 2) return { text: `${hours}h ${minutes}min`, color: 'text-orange-500' };
    if (hours < 24) return { text: `${hours}h`, color: 'text-gray-400' };
    return { text: `${Math.floor(hours/24)}d`, color: 'text-gray-400' };
  };

  if (perfilSeleccionado) {
    return <PerfilCreadorModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} eventos={eventos.filter(e => e.creadorId === perfilSeleccionado.id)} />;
  }

  return (
    <>
      {eventoSeleccionado && (
        <DetalleEventoModal
          evento={eventoSeleccionado}
          creador={perfiles[eventoSeleccionado.creadorId]}
          onClose={() => setEventoSeleccionado(null)}
          onVerPerfil={(p) => { setEventoSeleccionado(null); setPerfilSeleccionado(p); }}
          getTimeRemaining={getTimeRemaining}
        />
      )}

      <div className="agenda-container">
        {/* Filtros */}
        <div className="agenda-filters">
          <div className="filter-group">
            <label>CIUDAD</label>
            <div className="city-buttons">
              {Object.values(ciudadesData).map(c => (
                <button key={c.id} onClick={() => setCiudadSeleccionada(c.id)} className={ciudadSeleccionada === c.id ? 'active' : ''}>
                  {c.nombre}
                </button>
              ))}
              <label className="cercanas-checkbox">
                <input type="checkbox" checked={mostrarCercanas} onChange={e => setMostrarCercanas(e.target.checked)} />
                + cercanas
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label>CATEGORÍA</label>
            <div className="category-buttons">
              {categorias.map(cat => (
                <button key={cat.id} onClick={() => setCategoriaSeleccionada(cat.id)} className={categoriaSeleccionada === cat.id ? 'active' : ''}>
                  <span className="icon">{cat.icon}</span> {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>MOSTRAR DESDE</label>
            <select value={filtroHora} onChange={e => setFiltroHora(e.target.value)}>
              {horasDisponibles.map(h => <option key={h.valor} value={h.valor}>{h.label}</option>)}
            </select>
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="eventos-grid">
          {eventosFiltrados.map(evento => {
            const creador = perfiles[evento.creadorId];
            const time = getTimeRemaining(evento.fechaFin);
            return (
              <div key={evento.id} className="event-card" onClick={() => setEventoSeleccionado(evento)}>
                <div className="event-header">
                  <div className="creador-info">
                    <span className="emoji-xl">{evento.imagen}</span>
                    <div>
                      <button className="creador-nombre" onClick={e => { e.stopPropagation(); setPerfilSeleccionado(creador); }}>
                        {creador.nombre}
                      </button>
                      <p className="ciudad">{ciudadesData[creador.ciudad].nombre}</p>
                    </div>
                  </div>
                  {evento.esPublicidad && <span className="badge-publicidad">Publicidad</span>}
                </div>
                <h3 className="event-title">{evento.titulo}</h3>
                <p className="event-desc">{evento.descripcion}</p>
                <div className="event-footer">
                  <span className="precio">{evento.precio}</span>
                  <span className={`tiempo ${time.color}`}>
                    ⏱ {time.text}
                  </span>
                </div>
              </div>
            );
          })}

          {eventosFiltrados.length === 0 && (
            <div className="empty-state">
              <p className="emoji-big">😔</p>
              <h3>No hay eventos con estos filtros</h3>
              <p>Ajusta los filtros o sé el primero en publicar</p>
              <a href="/registro" className="btn-primary">🚀 Publica tu evento</a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Estilos 100% compatibles con el tema EstaNoche actual */
        .agenda-container { padding: 2rem 1rem; max-width: 1200px; margin: 0 auto; }
        .agenda-filters { background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
        .filter-group { margin-bottom: 1.5rem; }
        .filter-group label { display: block; color: var(--color-accent); font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .city-buttons, .category-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .city-buttons button, .category-buttons button { background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem 1rem; border-radius: 30px; font-size: 0.9rem; transition: all 0.2s; }
        .city-buttons button.active, .category-buttons button.active { background: var(--color-primary); }
        .cercanas-checkbox { color: #ccc; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
        select { background: rgba(0,0,0,0.4); border: 1px solid var(--color-primary); color: white; padding: 0.75rem; border-radius: 12px; }

        .eventos-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
        .event-card { background: rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s; backdrop-filter: blur(10px); }
        .event-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .event-header { padding: 1rem; display: flex; justify-content: space-between; align-items: flex-start; }
        .creador-info { display: flex; gap: 1rem; align-items: center; }
        .emoji-xl { font-size: 2.5rem; }
        .creador-nombre { color: white; font-weight: 700; font-size: 1.1rem; background: none; border: none; cursor: pointer; }
        .ciudad { color: var(--color-accent); font-size: 0.85rem; margin-top: 0.25rem; }
        .badge-publicidad { background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 4px 10px; border-radius: 12px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .event-title { padding: 0 1rem; font-size: 1.25rem; font-weight: 700; color: white; }
        .event-desc { padding: 0 1rem 1rem; color: #ddd; line-height: 1.5; }
        .event-footer { padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
        .precio { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
        .tiempo { font-weight: 600; font-size: 0.95rem; }

        .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: white; }
        .emoji-big { font-size: 5rem; margin-bottom: 1rem; }
        .btn-primary { background: var(--color-primary); color: black; padding: 1rem 2rem; border-radius: 30px; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 1rem; }
      `}</style>
    </>
  );
}