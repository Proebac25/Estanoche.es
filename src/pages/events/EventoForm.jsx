// FormEvento.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function FormEvento({ eventoExistente = null, onGuardado = () => {} }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen_url: '',
    categoria_id: '',
    ciudad: '',
    ubicacion: '',
    ubicacion_coords: '',
    fecha_inicio: '',
    fecha_fin: '',
    precio_actual: '',
    precio_original: '',
    tipo: 'concierto',
    visibilidad: 'publico',
    contactos_visibles: { 
      web: false, 
      facebook: false, 
      telefono: false, 
      whatsapp: true, 
      instagram: false, 
      googleMaps: true 
    },
    url_evento: '',
    entidad_local_id: '',
    entidad_protagonista_id: '',
    es_vip: false
  });

  const [categorias, setCategorias] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [modoProtagonista, setModoProtagonista] = useState('lista');
  const [protagonistaManual, setProtagonistaManual] = useState('');

  useEffect(() => {
    cargarDatosSelects();
    if (eventoExistente) {
      setFormData(eventoExistente);
      if (!eventoExistente.entidad_protagonista_id && eventoExistente.descripcion) {
        setModoProtagonista('manual');
      }
    }
  }, [eventoExistente]);

  const cargarDatosSelects = async () => {
    const { data: cats } = await supabase.from('categorias').select('id, nombre').eq('activo', true);
    setCategorias(cats || []);

    const { data: ents } = await supabase.from('entidades').select('id, nombre, rol_entidad').eq('visible_publico', true);
    setEntidades(ents || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      let protagonistaId = formData.entidad_protagonista_id;

      // Si se escribió manualmente, crear nueva entidad protagonista
      if (modoProtagonista === 'manual' && protagonistaManual.trim()) {
        const { data: nuevoProtagonista, error: errorProtagonista } = await supabase
          .from('entidades')
          .insert([{
            nombre: protagonistaManual,
            rol_entidad: 'protagonista',
            tipo_entidad: 'artista_manual',
            visible_publico: true,
            estado_entidad: 'activo'
          }])
          .select()
          .single();

        if (!errorProtagonista) {
          protagonistaId = nuevoProtagonista.id;
        }
      }

      const eventoData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        imagen_url: formData.imagen_url,
        categoria_id: formData.categoria_id || null,
        ciudad: formData.ciudad,
        ubicacion: formData.ubicacion,
        ubicacion_coords: formData.ubicacion_coords,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        precio_actual: formData.precio_actual,
        precio_original: formData.precio_original || null,
        tipo: formData.tipo,
        visibilidad: formData.visibilidad,
        contactos_visibles: formData.contactos_visibles,
        url_evento: formData.url_evento || null,
        entidad_local_id: formData.entidad_local_id,
        entidad_protagonista_id: protagonistaId || null,
        es_vip: formData.es_vip
      };

      if (eventoExistente) {
        const { error } = await supabase
          .from('eventos')
          .update({ 
            ...eventoData, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', eventoExistente.id);
        
        if (error) throw error;
        setMensaje('✅ Evento actualizado correctamente');
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('eventos')
          .insert([{ 
            ...eventoData,
            creador_id: user.id,
            app_origen: 'estanoche',
            estado: 'activo',
            vistas: 0,
            clics: 0
          }]);
        
        if (error) throw error;
        setMensaje('✅ Evento creado correctamente');
        // Limpiar formulario
        setFormData({
          titulo: '',
          descripcion: '',
          imagen_url: '',
          categoria_id: '',
          ciudad: '',
          ubicacion: '',
          ubicacion_coords: '',
          fecha_inicio: '',
          fecha_fin: '',
          precio_actual: '',
          precio_original: '',
          tipo: 'concierto',
          visibilidad: 'publico',
          contactos_visibles: { web: false, facebook: false, telefono: false, whatsapp: true, instagram: false, googleMaps: true },
          url_evento: '',
          entidad_local_id: '',
          entidad_protagonista_id: '',
          es_vip: false
        });
        setProtagonistaManual('');
        setModoProtagonista('lista');
      }
      
      onGuardado();
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al guardar el evento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContactoChange = (contacto, checked) => {
    setFormData(prev => ({
      ...prev,
      contactos_visibles: {
        ...prev.contactos_visibles,
        [contacto]: checked
      }
    }));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-evento">
        <h2>{eventoExistente ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
        
        {mensaje && (
          <div className={`mensaje ${mensaje.includes('❌') ? 'error' : 'exito'}`}>
            {mensaje}
          </div>
        )}

        <div className="seccion">
          <h3>📝 Información básica</h3>
          
          <div className="campo">
            <label>Título del evento *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Concierto de Rock Internacional"
            />
          </div>

          <div className="campo">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe tu evento, artistas, horarios, condiciones..."
            />
          </div>

          <div className="campo">
            <label>URL de la imagen</label>
            <input
              type="url"
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen-eventos.jpg"
            />
          </div>
        </div>

        <div className="seccion">
          <h3>📍 Ubicación y fechas</h3>
          
          <div className="campo">
            <label>Local *</label>
            <select
              name="entidad_local_id"
              value={formData.entidad_local_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar local</option>
              {entidades.filter(e => e.rol_entidad === 'local').map(entidad => (
                <option key={entidad.id} value={entidad.id}>
                  {entidad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Protagonista (Artista/Grupo)</label>
            <div className="modo-seleccion">
              <label className="radio-option">
                <input
                  type="radio"
                  value="lista"
                  checked={modoProtagonista === 'lista'}
                  onChange={(e) => setModoProtagonista(e.target.value)}
                />
                <span>Seleccionar de la lista</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="manual"  
                  checked={modoProtagonista === 'manual'}
                  onChange={(e) => setModoProtagonista(e.target.value)}
                />
                <span>Escribir manualmente</span>
              </label>
            </div>

            {modoProtagonista === 'lista' ? (
              <select
                name="entidad_protagonista_id"
                value={formData.entidad_protagonista_id}
                onChange={handleChange}
              >
                <option value="">Sin protagonista</option>
                {entidades.filter(e => e.rol_entidad === 'protagonista').map(entidad => (
                  <option key={entidad.id} value={entidad.id}>
                    {entidad.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Nombre del artista, banda o grupo..."
                value={protagonistaManual}
                onChange={(e) => setProtagonistaManual(e.target.value)}
                className="input-manual"
              />
            )}
          </div>

          <div className="campo">
            <label>Ciudad *</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              placeholder="Ej: Barcelona, Madrid, Valencia..."
            />
          </div>

          <div className="campo">
            <label>Ubicación específica *</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              placeholder="Ej: Sala Principal, Terraza, Planta 1..."
            />
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Fecha y hora de inicio *</label>
              <input
                type="datetime-local"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="campo">
              <label>Fecha y hora de fin *</label>
              <input
                type="datetime-local"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="seccion">
          <h3>💰 Detalles del evento</h3>
          
          <div className="campo">
            <label>Categoría</label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Precio actual *</label>
              <input
                type="text"
                name="precio_actual"
                value={formData.precio_actual}
                onChange={handleChange}
                required
                placeholder="Ej: 15€, Gratis, Entrada libre, 10-20€..."
              />
            </div>
            
            <div className="campo">
              <label>Precio original (opcional)</label>
              <input
                type="text"
                name="precio_original"
                value={formData.precio_original}
                onChange={handleChange}
                placeholder="Ej: 20€ (si hay descuento)"
              />
            </div>
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Tipo de evento</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="concierto">🎵 Concierto</option>
                <option value="fiesta">🎉 Fiesta</option>
                <option value="teatro">🎭 Teatro</option>
                <option value="deporte">⚽ Deporte</option>
                <option value="cultural">🏛️ Cultural</option>
                <option value="gastronomia">🍽️ Gastronomía</option>
                <option value="festival">🎪 Festival</option>
                <option value="exposicion">🖼️ Exposición</option>
              </select>
            </div>
            
            <div className="campo">
              <label>Visibilidad</label>
              <select
                name="visibilidad"
                value={formData.visibilidad}
                onChange={handleChange}
              >
                <option value="publico">🔓 Público</option>
                <option value="privado">🔒 Privado</option>
              </select>
            </div>
          </div>

          <div className="campo">
            <label>URL del evento (opcional)</label>
            <input
              type="url"
              name="url_evento"
              value={formData.url_evento}
              onChange={handleChange}
              placeholder="https://... (web oficial, entradas, etc.)"
            />
          </div>
        </div>

        <div className="seccion">
          <h3>⚙️ Configuración adicional</h3>
          
          <div className="campo-check">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="es_vip"
                checked={formData.es_vip}
                onChange={handleChange}
              />
              <span>🎭 Evento VIP (solo visible para clientes VIP)</span>
            </label>
          </div>

          <div className="campo">
            <label>📞 Contactos visibles</label>
            <div className="checkboxes-grid">
              {Object.entries(formData.contactos_visibles).map(([contacto, estado]) => (
                <label key={contacto} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={estado}
                    onChange={(e) => handleContactoChange(contacto, e.target.checked)}
                  />
                  <span>
                    {contacto === 'web' && '🌐 Web'}
                    {contacto === 'facebook' && '📘 Facebook'}
                    {contacto === 'telefono' && '📞 Teléfono'}
                    {contacto === 'whatsapp' && '💬 WhatsApp'}
                    {contacto === 'instagram' && '📷 Instagram'}
                    {contacto === 'googleMaps' && '🗺️ Google Maps'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="acciones">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primario"
          >
            {loading ? '⏳ Guardando...' : (eventoExistente ? '💾 Actualizar Evento' : '✨ Crear Evento')}
          </button>
        </div>
      </form>
    </div>
  );
}