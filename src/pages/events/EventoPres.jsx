// PaginaEntidad.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PaginaEntidad() {
  const { id } = useParams();
  const [entidad, setEntidad] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [redesSociales, setRedesSociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEntidad();
    cargarEventos();
    cargarRedesSociales();
  }, [id]);

  const cargarEntidad = async () => {
    try {
      const { data, error } = await supabase
        .from('entidades')
        .select('*')
        .eq('id', id)
        .eq('visible_publico', true)
        .single();

      if (error) throw error;
      setEntidad(data);
    } catch (error) {
      setError('Entidad no encontrada');
      console.error('Error:', error);
    }
  };

  const cargarEventos = async () => {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .or(`entidad_local_id.eq.${id},entidad_protagonista_id.eq.${id}`)
      .eq('estado', 'activo')
      .gte('fecha_fin', new Date().toISOString())
      .order('fecha_inicio', { ascending: true })
      .limit(10);

    if (!error) setEventos(data || []);
  };

  const cargarRedesSociales = async () => {
    const { data, error } = await supabase
      .from('redes_sociales')
      .select('*')
      .eq('propietario_id', id)
      .order('es_principal', { ascending: false });

    if (!error) setRedesSociales(data || []);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="cargando">Cargando entidad...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!entidad) return <div className="error">Entidad no encontrada</div>;

  return (
    <div className="pagina-entidad">
      {/* Header */}
      <div className="entidad-header">
        {entidad.imagen_url && (
          <img src={entidad.imagen_url} alt={entidad.nombre} className="entidad-imagen" />
        )}
        <div className="entidad-info-header">
          <h1>{entidad.nombre}</h1>
          <div className="entidad-meta">
            {entidad.tipo_entidad && <span className="tipo">{entidad.tipo_entidad}</span>}
            <span className="rol">{entidad.rol_entidad}</span>
            {entidad.ciudad && <span className="ciudad">📍 {entidad.ciudad}</span>}
          </div>
        </div>
      </div>

      <div className="entidad-contenido">
        {/* Descripción */}
        {entidad.descripcion && (
          <div className="entidad-seccion">
            <h2>📖 Sobre {entidad.nombre}</h2>
            <p className="descripcion">{entidad.descripcion}</p>
          </div>
        )}

        {/* Información de contacto y ubicación */}
        <div className="entidad-seccion">
          <h2>📍 Información</h2>
          <div className="info-grid">
            {entidad.direccion && (
              <div className="info-item">
                <strong>Dirección:</strong> {entidad.direccion}
              </div>
            )}
            {entidad.ciudad && (
              <div className="info-item">
                <strong>Ciudad:</strong> {entidad.ciudad}
              </div>
            )}
            {entidad.provincia && (
              <div className="info-item">
                <strong>Provincia:</strong> {entidad.provincia}
              </div>
            )}
            {entidad.codigo_postal && (
              <div className="info-item">
                <strong>Código Postal:</strong> {entidad.codigo_postal}
              </div>
            )}
            {entidad.email && (
              <div className="info-item">
                <strong>Email:</strong> 
                <a href={`mailto:${entidad.email}`}>{entidad.email}</a>
              </div>
            )}
            {entidad.coordenadas && (
              <div className="info-item">
                <a 
                  href={`https://maps.google.com/?q=${entidad.coordenadas}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-mapa"
                >
                  🗺️ Ver en mapa
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Redes Sociales */}
        {redesSociales.length > 0 && (
          <div className="entidad-seccion">
            <h2>🌐 Redes Sociales</h2>
            <div className="redes-sociales">
              {redesSociales.map(red => (
                <a 
                  key={red.id}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`red-social ${red.es_principal ? 'principal' : ''}`}
                >
                  {red.imagen_logo ? (
                    <img src={red.imagen_logo} alt={red.tipo_red} />
                  ) : (
                    <span>{red.tipo_red}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Eventos próximos */}
        {eventos.length > 0 && (
          <div className="entidad-seccion">
            <h2>🎭 Eventos Próximos</h2>
            <div className="eventos-lista">
              {eventos.map(evento => (
                <Link key={evento.id} to={`/evento/${evento.id}`} className="evento-card">
                  <div className="evento-fecha">
                    {formatearFecha(evento.fecha_inicio)}
                  </div>
                  <div className="evento-info">
                    <h3>{evento.titulo}</h3>
                    <p className="evento-precio">{evento.precio_actual}</p>
                    {evento.es_vip && <span className="vip-badge">VIP</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Estado y visibilidad */}
        <div className="entidad-seccion">
          <h2>ℹ️ Estado</h2>
          <div className="estado-info">
            <div className={`estado ${entidad.estado_entidad}`}>
              {entidad.estado_entidad}
            </div>
            <div className="visibilidad">
              {entidad.visible_publico ? 'Público' : 'Privado'}
            </div>
            {entidad.email_verificado && (
              <div className="verificado">✓ Email verificado</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}