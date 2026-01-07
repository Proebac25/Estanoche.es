// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ThemeContext = createContext();

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Intentar obtener el tema de sessionStorage al iniciar
    const savedTheme = sessionStorage.getItem('esta-noche-theme');
    return savedTheme || 'day';
  });

  // Efecto para guardar en sessionStorage cuando cambia el tema
  useEffect(() => {
    sessionStorage.setItem('esta-noche-theme', theme);

    // Aplicar tema al documento
    const cls = `site-theme-${theme}`;
    document.documentElement.classList.remove('site-theme-day', 'site-theme-night', 'dark');
    document.documentElement.classList.add(cls);
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
    }

    // Actualizar color de fondo globalmente
    const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
  }, [theme]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'day' ? 'night' : 'day');
  };

  // Valor del contexto
  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};