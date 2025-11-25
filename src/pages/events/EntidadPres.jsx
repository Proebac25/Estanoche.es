// PaginaEntidad.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PaginaEntidad() {
  const { id } = useParams();
  const [entidad, setEntidad] = useState(null);
  const [eventosProximos, setEventosProximos] = useState([]);
  const [eventosPasados, setEventosPasados] = useState([]);
  const [redesSociales, setRedesSociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      // Cargar entidad
      const { data: entidadData, error: entidadError } = await supabase
        .from('entidades')
        .select('*')
        .eq('id', id)
        .eq('visible_publico', true)
        .single();

      if (entidadError) throw entidadError;
      setEntidad(entidadData);

      // Cargar eventos (como local y como protagonista)
      const { data: eventosData, error: eventosError } = await supabase
        .from('eventos')
        .select(`
          *,
          categorias:categoria_id(nombre, icono_emoji),
          local:entidad_local_id(nombre),
          protagonista:entidad_protagonista_id(nombre)
        `)
        .or(`entidad_local_id.eq.${id},entidad_protagonista_id.eq.${id}`)
        .eq('estado', 'activo')
        .order('fecha_inicio', { ascending: true });

      if (!eventosError) {
        const ahora = new Date();
        const proximos = eventosData.filter(evento => new Date(evento.fecha_fin) >= ahora);
        const pasados = eventosData.filter(evento => new Date(evento.fecha_fin) < ahora);
        
        setEventosProximos(proximos);
        setEventosPasados(pasados);
      }

      // Cargar redes sociales
      const { data: redesData, error: redesError } = await supabase
        .from('redes_sociales')
        .select('*')
        .eq('propietario_id', id)
        .order('es_principal', { ascending: false });

      if (!redesError) setRedesSociales(redesData || []);

    } catch (error) {
      setError('Entidad no encontrada');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIconoRedSocial = (tipoRed) => {
    const iconos = {
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      youtube: '📺',
      tiktok: '🎵',
      web: '🌐',
      whatsapp: '💬',
      telegram: '📢',
      spotify: '🎵',
      soundcloud: '☁️'
    };
    return iconos[tipoRed] || '🔗';
  };

  if (loading) return <div className="cargando">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!entidad) return <div className="error">Entidad no encontrada</div>;

  return (
    <div className="pagina-entidad">
      {/* Header con imagen */}
      <div className="entidad-header">
        {entidad.imagen_url && (
          <img src={entidad.imagen_url} alt={entidad.nombre} className="entidad-imagen-principal" />
        )}
        <div className="entidad-info-basica">
          <h1>{entidad.nombre}</h1>
          <div className="entidad-etiquetas">
            <span className={`rol ${entidad.rol_entidad}`}>
              {entidad.rol_entidad === 'local' ? '🏠 Local' : '🎤 Artista/Grupo'}
            </span>
            {entidad.tipo_entidad && (
              <span className="tipo-entidad">{entidad.tipo_entidad}</span>
            )}
            {entidad.ciudad && (
              <span className="ciudad">📍 {entidad.ciudad}</span>
            )}
          </div>
        </div>
      </div>

      <div className="entidad-contenido">
        {/* Descripción */}
        {entidad.descripcion && (
          <section className="entidad-seccion">
            <h2>📖 Sobre nosotros</h2>
            <p className="descripcion">{entidad.descripcion}</p>
          </section>
        )}

        {/* Información de contacto */}
        <section className="entidad-seccion">
          <h2>📍 Información de contacto</h2>
          <div className="info-contacto">
            {entidad.direccion && (
              <div className="info-item">
                <strong>Dirección:</strong>
                <span>{entidad.direccion}</span>
                {entidad.coordenadas && (
                  <a 
                    href={`https://maps.google.com/?q=${entidad.coordenadas}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="enlace-mapa"
                  >
                    🗺️ Ver en mapa
                  </a>
                )}
              </div>
            )}
            
            {(entidad.ciudad || entidad.provincia || entidad.codigo_postal) && (
              <div className="info-item">
                <strong>Ubicación:</strong>
                <span>
                  {[entidad.ciudad, entidad.provincia, entidad.codigo_postal]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}

            {entidad.email && (
              <div className="info-item">
                <strong>Email:</strong>
                <a href={`mailto:${entidad.email}`}>{entidad.email}</a>
                {entidad.email_verificado && <span className="verificado">✓ Verificado</span>}
              </div>
            )}
          </div>
        </section>

        {/* Redes Sociales */}
        {redesSociales.length > 0 && (
          <section className="entidad-seccion">
            <h2>🌐 Síguenos en</h2>
            <div className="redes-sociales-grid">
              {redesSociales.map(red => (
                <a
                  key={red.id}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`red-social ${red.es_principal ? 'principal' : ''}`}
                >
                  <span className="red-icono">
                    {obtenerIconoRedSocial(red.tipo_red)}
                  </span>
                  <span className="red-nombre">{red.tipo_red}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Eventos Próximos */}
        {eventosProximos.length > 0 && (
          <section className="entidad-seccion">
            <h2>🎭 Próximos Eventos</h2>
            <div className="eventos-lista">
              {eventosProximos.map(evento => (
                <Link key={evento.id} to={`/evento/${evento.id}`} className="evento-tarjeta">
                  <div className="evento-fecha">
                    {formatearFecha(evento.fecha_inicio)}
                  </div>
                  <div className="evento-contenido">
                    <h3>{evento.titulo}</h3>
                    <p className="evento-descripcion-corta">
                      {evento.descripcion?.substring(0, 100)}...
                    </p>
                    <div className="evento-detalles">
                      <span className="evento-precio">{evento.precio_actual}</span>
                      {evento.categorias && (
                        <span className="evento-categoria">
                          {evento.categorias.icono_emoji} {evento.categorias.nombre}
                        </span>
                      )}
                      {evento.es_vip && <span className="evento-vip">VIP</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Eventos Pasados */}
        {eventosPasados.length > 0 && (
          <section className="entidad-seccion">
            <h2>📅 Eventos Anteriores</h2>
            <div className="eventos-lista pasados">
              {eventosPasados.slice(0, 5).map(evento => (
                <div key={evento.id} className="evento-tarjeta pasado">
                  <div className="evento-fecha">
                    {formatearFecha(evento.fecha_inicio)}
                  </div>
                  <div className="evento-contenido">
                    <h3>{evento.titulo}</h3>
                    <div className="evento-estadisticas">
                      <span>👁️ {evento.vistas || 0} vistas</span>
                      <span>👆 {evento.clics || 0} clics</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sin eventos */}
        {eventosProximos.length === 0 && eventosPasados.length === 0 && (
          <section className="entidad-seccion">
            <h2>🎭 Eventos</h2>
            <div className="sin-eventos">
              <p>
                {entidad.rol_entidad === 'local' 
                  ? 'Este local aún no tiene eventos programados.'
                  : 'Este artista/grupo aún no tiene eventos programados.'
                }
              </p>
            </div>
          </section>
        )}

        {/* Estado */}
        <section className="entidad-seccion">
          <h2>ℹ️ Estado</h2>
          <div className="estado-entidad">
            <div className={`estado-badge ${entidad.estado_entidad}`}>
              {entidad.estado_entidad}
            </div>
            <div className="visibilidad">
              {entidad.visible_publico ? '🔓 Visible al público' : '🔒 Perfil privado'}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}