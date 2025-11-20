import React, { useEffect, useState } from 'react'

// FichaUsuario.jsx
// Versión React de BUficha_usuario.html
// Conserva el diseño original, adapta los scripts a React y añade el footer requerido.

export default function FichaUsuario() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [postal, setPostal] = useState('')
  const [accountType, setAccountType] = useState('usuario')
  const [businessName, setBusinessName] = useState('')
  const [cif, setCif] = useState('')
  const [bio, setBio] = useState('')
  const [instagram, setInstagram] = useState('')
  const [website, setWebsite] = useState('')
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)

  useEffect(() => {
    // Rellenar campos desde querystring si existen
    const params = new URLSearchParams(window.location.search)
    if (params.has('email')) setEmail(params.get('email') || '')
    if (params.has('telefono')) setPhone(params.get('telefono') || '')
    if (params.has('nombre')) setFullName(params.get('nombre') || '')
    if (params.has('ciudad')) setCity(params.get('ciudad') || '')
  }, [])

  function handleGuardar(e) {
    e.preventDefault()
    if (!check1 || !check2) {
      alert('⚠️ Debes descargar y marcar ambos documentos para continuar')
      return
    }
    alert('¡Perfil guardado con éxito!\nBienvenido a EstaNoche.es')
    // Aquí iría la llamada a la API para persistir datos
  }

  return (
    <div>
      <div className="hero-bg" />

      <header className="container">
        <div>
          <div className="logo">EstaNoche.es</div>
          <div className="logo-subtitle">Tu agenda de ocio</div>
        </div>
        <a href="mailto:proebac25@estanoche.es" className="btn-gradiente btn-header">Contacto</a>
      </header>

      <div className="container">
        <div className="content">
          <h1>Mi perfil completo</h1>
          <p className="success">¡Código verificado! Completa tu perfil</p>

          <form className="form" onSubmit={handleGuardar}>
            <div className="label">Nombre completo *</div>
            <input
              type="text"
              id="full_name"
              placeholder="Juan Pérez García"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div className="label">Email (usuario) *</div>
            <input type="email" id="email" disabled value={email} />

            <div className="label">Teléfono móvil *</div>
            <input type="tel" id="phone" disabled value={phone} />

            <div className="label">Ciudad *</div>
            <input
              type="text"
              id="location_city"
              placeholder="Jerez de la Frontera"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <div className="label">Código postal</div>
            <input
              type="text"
              id="postal_code"
              placeholder="11402"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
            />

            <div className="label">Tipo de cuenta</div>
            <select id="account_type" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="usuario">Usuario normal</option>
              <option value="creador">Creador / Profesional</option>
              <option value="negocio">Negocio / Local</option>
            </select>

            { (accountType === 'creador' || accountType === 'negocio') && (
              <div id="negocio-section">
                <div className="label">Nombre del negocio</div>
                <input type="text" id="business_name" value={businessName} onChange={(e)=>setBusinessName(e.target.value)} />
                <div className="label">CIF / NIF</div>
                <input type="text" id="cif" value={cif} onChange={(e)=>setCif(e.target.value)} />
                <div className="label">Descripción corta</div>
                <textarea rows="3" id="bio_description" value={bio} onChange={(e)=>setBio(e.target.value)} />
              </div>
            )}

            <div className="label">Instagram (opcional)</div>
            <input type="text" id="instagram" placeholder="@estanoche_jerez" value={instagram} onChange={(e)=>setInstagram(e.target.value)} />

            <div className="label">Web (opcional)</div>
            <input type="url" id="website_url" value={website} onChange={(e)=>setWebsite(e.target.value)} />

            <div className="legal">
              <p><strong>Descarga y lee los documentos antes de aceptar</strong></p>

              <label>
                <input type="checkbox" id="check1" checked={check1} onChange={(e)=>setCheck1(e.target.checked)} />
                He descargado y leído la 
                <a href="/legal/Política_de_Privacidad_EstaNoche.pdf" download onClick={() => setCheck1(true)}>
                  Política de Privacidad
                </a>
              </label>

              <label>
                <input type="checkbox" id="check2" checked={check2} onChange={(e)=>setCheck2(e.target.checked)} />
                He descargado y leído los 
                <a href="/legal/Términos_y_Condiciones_EstaNoche.pdf" download onClick={() => setCheck2(true)}>
                  Términos y Condiciones
                </a>
              </label>
            </div>

            <div className="buttons">
              <a href="/" className="btn-gradiente">Volver</a>
              <button id="btn-guardar" className="btn-gradiente" style={{width: '100%', padding: '1.1rem'}} type="submit">Guardar</button>
            </div>

          </form>

          <p style={{marginTop: '1.5rem', fontSize: '0.875rem', color: '#B3B3B3'}}>© 2025 Proebac · Todos los derechos reservados</p>
        </div>
      </div>

      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#121212;color:white;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,sans-serif}
        .hero-bg{background:linear-gradient(135deg,#3C3C8A 0%,#1C1C3A 40%,#F72585 100%);background-size:200% 200%;animation:gradient 15s ease infinite;position:fixed;inset:0;z-index:-1}
        @keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .container{max-width:1280px;margin:0 auto;padding:0 1rem;position:relative;z-index:1}
        header{display:flex;justify-content:space-between;align-items:center;padding:1rem}
        .logo{font-weight:bold;font-size:1.25rem}
        .logo-subtitle{font-size:0.875rem;color:#B3B3B3}
        .btn-gradiente{background:linear-gradient(90deg,#F72585,#FFB703);padding:0.9rem 2.5rem;border:none;border-radius:9999px;color:white;font-weight:bold;cursor:pointer;transition:all .3s}
        .btn-header{font-size:0.75rem;padding:0.5rem 1rem}
        .content{max-width:48rem;margin:4rem auto;background:rgba(18,18,18,0.95);padding:3rem 2.5rem;border-radius:1.8rem;backdrop-filter:blur(14px);text-align:center}
        h1{font-size:2.6rem;margin-bottom:1.5rem;font-family:'Playfair Display',serif}
        .form{max-width:420px;margin:0 auto}
        input,select,textarea{width:100%;padding:1rem;margin-bottom:1.8rem;border-radius:14px;border:none;background:rgba(255,255,255,0.1);color:white;font-size:1rem}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.6)}
        input:disabled{background:rgba(255,255,255,0.05);color:#ccc}
        .label{text-align:left;font-size:0.95rem;color:#FFB703;margin-bottom:0.6rem;font-weight:600}
        .buttons{display:flex;gap:1.5rem;justify-content:center;margin-top:3rem}
        .success{color:#25D366;font-weight:bold;margin-bottom:1.5rem}
        .legal{font-size:0.95rem;color:#B3B3B3;margin:3rem 0 2rem;line-height:1.6;text-align:center}
        .legal a{color:#FFB703;text-decoration:underline}
        .legal label{display:flex;align-items:center;gap:0.8rem;margin:1.2rem 0;font-size:1rem;color:white;justify-content:center}
        .legal input[type=checkbox]{width:1.4rem;height:1.4rem;accent-color:#FFB703}
      `}</style>
    </div>
  )
}
