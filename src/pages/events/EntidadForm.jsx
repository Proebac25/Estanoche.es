// FormEntidad.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function FormEntidad({ entidadExistente = null, onGuardado = () => {} }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo_entidad: '',
    imagen_url: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    coordenadas: '',
    email: '',
    estado_entidad: 'activo',
    visible_publico: true,
    configuraciones: {},
    rol_entidad: 'local'
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (entidadExistente) {
      setFormData(entidadExistente);
    }
  }, [entidadExistente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      if (entidadExistente) {
        const { error } = await supabase
          .from('entidades')
          .update({ 
            ...formData, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', entidadExistente.id);
        
        if (error) throw error;
        setMensaje('✅ Entidad actualizada correctamente');
      } else {
        const { error } = await supabase
          .from('entidades')
          .insert([{ 
            ...formData,
            email_verificado: false
          }]);
        
        if (error) throw error;
        setMensaje('✅ Entidad creada correctamente');
        setFormData({
          nombre: '',
          descripcion: '',
          tipo_entidad: '',
          imagen_url: '',
          direccion: '',
          ciudad: '',
          provincia: '',
          codigo_postal: '',
          coordenadas: '',
          email: '',
          estado_entidad: 'activo',
          visible_publico: true,
          configuraciones: {},
          rol_entidad: 'local'
        });
      }
      
      onGuardado();
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al guardar la entidad: ' + error.message);
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

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-entidad">
        <h2>{entidadExistente ? 'Editar Entidad' : 'Crear Nueva Entidad'}</h2>
        
        {mensaje && (
          <div className={`mensaje ${mensaje.includes('❌') ? 'error' : 'exito'}`}>
            {mensaje}
          </div>
        )}

        <div className="seccion">
          <h3>🏷️ Información básica</h3>
          
          <div className="campo">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder={formData.rol_entidad === 'local' 
                ? "Ej: Sala Razzmatazz, Bar Velvet, Teatro Principal..." 
                : "Ej: Mago Soler, DJ Marta, Banda The Rockers..."
              }
            />
          </div>

          <div className="campo">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder={formData.rol_entidad === 'local' 
                ? "Describe el local, ambiente, servicios, aforo..." 
                : "Describe el artista/grupo, estilo musical, experiencia..."
              }
            />
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Tipo de entidad</label>
              <input
                type="text"
                name="tipo_entidad"
                value={formData.tipo_entidad}
                onChange={handleChange}
                placeholder={formData.rol_entidad === 'local' 
                  ? "Ej: Sala de conciertos, Bar, Discoteca..." 
                  : "Ej: Banda de rock, DJ, Artista flamenco..."
                }
              />
            </div>

            <div className="campo">
              <label>Rol *</label>
              <select
                name="rol_entidad"
                value={formData.rol_entidad}
                onChange={handleChange}
                required
              >
                <option value="local">🏠 Local</option>
                <option value="protagonista">🎤 Protagonista (Artista/Grupo)</option>
              </select>
            </div>
          </div>

          <div className="campo">
            <label>URL de la imagen</label>
            <input
              type="url"
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen-local.jpg"
            />
          </div>
        </div>

        <div className="seccion">
          <h3>📍 Ubicación</h3>
          
          <div className="campo">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle, número, piso..."
            />
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ej: Barcelona"
              />
            </div>

            <div className="campo">
              <label>Provincia</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                placeholder="Ej: Barcelona"
              />
            </div>
          </div>

          <div className="campo-doble">
            <div className="campo">
              <label>Código Postal</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                placeholder="08001"
              />
            </div>

            <div className="campo">
              <label>Coordenadas (lat, lng)</label>
              <input
                type="text"
                name="coordenadas"
                value={formData.coordenadas}
                onChange={handleChange}
                placeholder="41.38879, 2.15899"
              />
            </div>
          </div>
        </div>

        <div className="seccion">
          <h3>📞 Contacto y visibilidad</h3>
          
          <div className="campo">
            <label>Email de contacto</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contacto@ejemplo.com"
            />
          </div>

          <div className="campo">
            <label>Estado</label>
            <select
              name="estado_entidad"
              value={formData.estado_entidad}
              onChange={handleChange}
            >
              <option value="activo">✅ Activo</option>
              <option value="inactivo">⏸️ Inactivo</option>
              <option value="pendiente">⏳ Pendiente</option>
            </select>
          </div>

          <div className="campo-check">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="visible_publico"
                checked={formData.visible_publico}
                onChange={handleChange}
              />
              <span>👁️ Visible para el público</span>
            </label>
          </div>
        </div>

        <div className="acciones">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primario"
          >
            {loading ? '⏳ Guardando...' : (entidadExistente ? '💾 Actualizar Entidad' : '✨ Crear Entidad')}
          </button>
        </div>
      </form>
    </div>
  );
}