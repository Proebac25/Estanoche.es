import { BrowserRouter } from 'react-router-dom'
import Router from './Router.jsx'    // ← si usas Router separado
// o si tienes las rutas aquí directamente, no cambies nada más

export default function App() {
  return (
    <BrowserRouter>
      <Router />   // o <Routes> aquí directamente
    </BrowserRouter>
  )
}