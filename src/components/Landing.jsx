<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EstaNoche - Especial Zambombas de Jerez</title>
  <link rel="manifest" href="/manifest.json">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#121212;color:white;font-family:system-ui,sans-serif;overflow-x:hidden}
    canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;opacity:0.6}
    .hero-bg{position:fixed;inset:0;background:linear-gradient(135deg,#3C3C8A,#1C1C3A 40%,#F72585);background-size:200%;animation:g 20s ease infinite;z-index:-2}
    @keyframes g{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    header{padding:1.5rem;display:flex;justify-content:space-between;align-items:center;z-index:10}
    .logo{font-weight:bold;font-size:1.8rem}
    .logo-sub{font-size:0.9rem;color:#B3B3B3}
    .btn{background:linear-gradient(90deg,#F72585,#FFB703);color:white;font-weight:bold;padding:1rem 3rem;border-radius:9999px;text-decoration:none;display:inline-block;transition:.3s;box-shadow:0 8px 20px rgba(247,37,133,.3)}
    .btn:hover{transform:translateY(-4px);box-shadow:0 15px 30px rgba(247,37,133,.5)}
    .btn-large{padding:1.5rem 4.5rem;font-size:1.4rem}
    .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;position:relative}
    .inner{max-width:50rem;width:100%}
    .emoji{font-size:4.5rem;margin-bottom:1rem}
    .title{font-size:3.5rem;font-weight:900;line-height:1.1;margin-bottom:1rem}
    .grad{background:linear-gradient(90deg,#FFB703,#F72585);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .sub{font-size:1.4rem;opacity:0.9;margin-bottom:4rem}
    .secondary{margin:2rem 0 4rem} /* ESPACIO ENTRE BOTONES Y TÍTULO SUPERIOR */
    .about{margin-top:4rem} /* ESPACIO SIMÉTRICO ENTRE BOTONES Y “DESCUBRE...” */
  </style>
</head>
<body>

  <div class="hero-bg"></div>
  <canvas id="stars"></canvas>

  <header>
    <div>
      <div class="logo">EstaNoche.es</div>
      <div class="logo-sub">Tu agenda de ocio</div>
    </div>
    <a href="mailto:proebac25@estanoche.es" class="btn" style="padding:.8rem 2rem;font-size:.9rem">Contacto</a>
  </header>

  <section class="hero">
    <div class="inner">

      <!-- MARCA DE AGUA -->
      <div style="position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);pointer-events:none;opacity:0.20;color:white;font-weight:800;font-size:clamp(2rem,12vw,6rem);line-height:1.1;text-align:center;width:100%">
        Especial <br>Zambombas de Jerez.<br>Disponible en Breve
      </div>

      <div class="emoji">🌙 <img src="/assets/Icon_Zambomba.png" alt="Zambomba" style="width:2.2em;height:2.2em, vertical-align:middle"></div>
      
      <h1 class="title">Descubre el ocio<br><span class="grad">de tu ciudad</span></h1>
      <p class="sub">Conciertos, eventos y planes únicos. Sin descargas. Sin complicaciones.</p>
      
      <a href="/pages/agenda.html" class="btn btn-large">Ver eventos</a>

      <div class="secondary" style="display:flex;gap:2rem;justify-content:center;flex-wrap:wrap">
        <a href="/pages/alta_usuario.html" class="btn">Registrarse</a>
        <a href="/pages/registro-usuario.html" class="btn">Iniciar sesión</a>
      </div>

      <div class="about">
        <h2 style="font-size:2.2rem;margin-bottom:2rem">Descubre quiénes somos y por qué lo hacemos</h2>
        <a href="/pages/sobre.html" class="btn" style="padding:1.2rem 3.5rem;font-size:1.2rem">Sobre nosotros</a>
      </div>

    </div>
  </section>

  <div id="root"></div>
  <script type="module" src="/src/Main.jsx"></script>

  <script>
    const c=document.getElementById('stars'),x=c.getContext('2d');
    c.width=innerWidth;c.height=innerHeight;
    const s=Array.from({length:150},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.5,a:Math.random()}));
    (function d(){x.clearRect(0,0,c.width,c.height);x.fillStyle='#FFB703';s.forEach(t=>{x.globalAlpha=t.a;x.beginPath();x.arc(t.x,t.y,t.r,0,Math.PI*2);x.fill();t.a=0.5+Math.sin(Date.now()*0.001+t.x)*0.5});requestAnimationFrame(d)})();
    addEventListener('resize',()=>{c.width=innerWidth;c.height=innerHeight});
  </script>
</body>
</html>