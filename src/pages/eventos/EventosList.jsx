import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';

const EventosList = () => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-mo-bg dark:bg-gray-900 flex flex-col transition-colors duration-300">
            <Header theme={theme} />

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
                <h1 className="font-display text-3xl font-bold text-mo-text dark:text-white mb-6">
                    Eventos
                </h1>

                <div className="p-12 text-center text-mo-muted bg-white dark:bg-gray-800 rounded-mo border border-gray-100 dark:border-gray-700">
                    <p>Próximamente: Listado de eventos.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventosList;
