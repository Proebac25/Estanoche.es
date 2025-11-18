import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FormField from '../components/FormField'

export default function crearlocalogrupo() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState('local')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    calle: '',
    poblacion: '',
    cp: '',
    provincia: 'Cádiz',
    telefono: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    web: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const guardar = () => {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio')
    console.log('Local/Grupo creado:', { tipo, ...form })
    alert('¡Local o grupo creado con éxito!')
    navigate('/agenda')
  }

  const provincias = [
    { value: '', label: 'Selecciona provincia' },
    { value: 'Cádiz', label: 'Cádiz' },
    { value: 'Sevilla', label: 'Sevilla' },
    { value: 'Málaga', label: 'Málaga' },
    // resto...
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      <Header />

      <div className="pt-32 pb-40 px-4">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-10">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Crear mi {tipo === 'local' ? 'local' : 'grupo'}
          </h1>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                label="Tipo"
                type="select"
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                options={[
                  { value: 'local', label: 'Local / Bar / Sala' },
                  { value: 'grupo', label: 'Grupo musical / Artista' }
                ]}
              />
            </div>

            <FormField label="Nombre *" id="nombre" value={form.nombre} onChange={handleChange} required />

            <FormField label="Descripción" type="textarea" id="descripcion" value={form.descripcion} onChange={handleChange} />

            {tipo === 'local' && (
              <>
                <FormField label="Dirección (calle y número)" id="calle" value={form.calle} onChange={handleChange} />
                <FormField label="Población / Ciudad" id="poblacion" value={form.poblacion} onChange={handleChange} maxLength="60" />
                <FormField label="Código postal" id="cp" value={form.cp} onChange={handleChange} maxLength="10" />
                <FormField label="Provincia" type="select" id="provincia" value={form.provincia} onChange={handleChange} options={provincias} required />
              </>
            )}

            <FormField label="Teléfono público" id="telefono" value={form.telefono} onChange={handleChange} />
            <FormField label="WhatsApp público" id="whatsapp" value={form.whatsapp} onChange={handleChange} />
            <FormField label="Instagram" id="instagram" value={form.instagram} onChange={handleChange} />
            <FormField label="Facebook" id="facebook" value={form.facebook} onChange={handleChange} />
            <FormField label="TikTok" id="tiktok" value={form.tiktok} onChange={handleChange} />
            <FormField label="Web" id="web" value={form.web} onChange={handleChange} />

            <div className="md:col-span-2">
              <FormField label="Logo o foto" type="file" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

