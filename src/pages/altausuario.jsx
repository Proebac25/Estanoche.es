import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FormField from '../components/FormField'

export default function altausuario() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    calle: '',
    poblacion: '',
    cp: '',
    provincia: 'Cádiz',
    instagram: '',
    facebook: '',
    tiktok: '',
    web: '',
    bio: '',
    publicar: 'no'
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.has('email')) {
      setForm(prev => ({
        ...prev,
        email: params.get('email') || '',
        telefono: params.get('telefono') || ''
      }))
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const guardar = () => {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio')

    // Aquí irá Supabase cuando esté listo
    console.log('Perfil guardado:', form)

    alert('¡Perfil guardado con éxito!')

    // Ruta correcta: "o" de "local o grupo"
    if (form.publicar === 'si') {
      navigate('/crear_local_o_grupo')
    } else {
      navigate('/agenda')
    }
  }

  const provincias = [
    { value: '', label: 'Selecciona provincia' },
    { value: 'Álava', label: 'Álava' },
    { value: 'Albacete', label: 'Albacete' },
    { value: 'Alicante', label: 'Alicante' },
    { value: 'Almería', label: 'Almería' },
    { value: 'Asturias', label: 'Asturias' },
    { value: 'Ávila', label: 'Ávila' },
    { value: 'Badajoz', label: 'Badajoz' },
    { value: 'Baleares', label: 'Baleares' },
    { value: 'Barcelona', label: 'Barcelona' },
    { value: 'Bizkaia', label: 'Bizkaia' },
    { value: 'Burgos', label: 'Burgos' },
    { value: 'Cáceres', label: 'Cáceres' },
    { value: 'Cádiz', label: 'Cádiz' },
    { value: 'Cantabria', label: 'Cantabria' },
    { value: 'Castellón', label: 'Castellón' },
    { value: 'Ceuta', label: 'Ceuta' },
    { value: 'Ciudad Real', label: 'Ciudad Real' },
    { value: 'Córdoba', label: 'Córdoba' },
    { value: 'A Coruña', label: 'A Coruña' },
    { value: 'Cuenca', label: 'Cuenca' },
    { value: 'Gipuzkoa', label: 'Gipuzkoa' },
    { value: 'Girona', label: 'Girona' },
    { value: 'Granada', label: 'Granada' },
    { value: 'Guadalajara', label: 'Guadalajara' },
    { value: 'Huelva', label: 'Huelva' },
    { value: 'Huesca', label: 'Huesca' },
    { value: 'Jaén', label: 'Jaén' },
    { value: 'León', label: 'León' },
    { value: 'Lleida', label: 'Lleida' },
    { value: 'Lugo', label: 'Lugo' },
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Málaga', label: 'Málaga' },
    { value: 'Melilla', label: 'Melilla' },
    { value: 'Murcia', label: 'Murcia' },
    { value: 'Navarra', label: 'Navarra' },
    { value: 'Ourense', label: 'Ourense' },
    { value: 'Palencia', label: 'Palencia' },
    { value: 'Las Palmas', label: 'Las Palmas' },
    { value: 'Pontevedra', label: 'Pontevedra' },
    { value: 'La Rioja', label: 'La Rioja' },
    { value: 'Salamanca', label: 'Salamanca' },
    { value: 'Santa Cruz de Tenerife', label: 'Santa Cruz de Tenerife' },
    { value: 'Segovia', label: 'Segovia' },
    { value: 'Sevilla', label: 'Sevilla' },
    { value: 'Soria', label: 'Soria' },
    { value: 'Tarragona', label: 'Tarragona' },
    { value: 'Teruel', label: 'Teruel' },
    { value: 'Toledo', label: 'Toledo' },
    { value: 'Valencia', label: 'Valencia' },
    { value: 'Valladolid', label: 'Valladolid' },
    { value: 'Zamora', label: 'Zamora' },
    { value: 'Zaragoza', label: 'Zaragoza' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      <Header />

      <div className="pt-32 pb-40 px-4 flex-1 w-full">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-10">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Completa tu perfil</h1>
          <p className="text-center text-green-400 font-bold mb-10">¡Móvil verificado! Rellena tus datos</p>

          <div className="grid md:grid-cols-2 gap-8">
            <FormField label="Nombre completo" id="nombre" value={form.nombre} onChange={handleChange} required />
            <FormField label="Dirección (calle y número)" id="calle" value={form.calle} onChange={handleChange} />
            <FormField label="Población / Ciudad" id="poblacion" value={form.poblacion} onChange={handleChange} maxLength="60" />
            <FormField label="Código postal" id="cp" value={form.cp} onChange={handleChange} maxLength="10" />
            <FormField label="Provincia" type="select" id="provincia" value={form.provincia} onChange={handleChange} options={provincias} required />
            <FormField label="Instagram" id="instagram" value={form.instagram} onChange={handleChange} />
            <FormField label="Facebook" id="facebook" value={form.facebook} onChange={handleChange} />
            <FormField label="TikTok" id="tiktok" value={form.tiktok} onChange={handleChange} />
            <FormField label="Web" id="web" value={form.web} onChange={handleChange} />
            <div className="md:col-span-2">
              <FormField label="Foto de perfil" type="file" />
            </div>
            <div className="md:col-span-2">
              <FormField label="Descripción / bio" type="textarea" id="bio" value={form.bio} onChange={handleChange} placeholder="Ej. Amante del flamenco y las zambombas de Jerez" />
            </div>
            <div className="md:col-span-2">
              <FormField 
                label="¿Quieres publicar eventos?" 
                type="select" 
                id="publicar" 
                value={form.publicar} 
                onChange={handleChange}
                options={[
                  { value: 'no', label: 'No, solo quiero ver eventos' },
                  { value: 'si', label: 'Sí, quiero crear locales y eventos' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

