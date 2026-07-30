// src/App.jsx
import React from "react";
import AppRoutes from "./Routes.jsx";
import CookieBanner from "./components/CookieBanner.jsx";

export default function App() {
  return (
    <>
      <AppRoutes />
      <CookieBanner />
    </>
  );
}
