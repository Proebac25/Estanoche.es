import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPlus, FaTimes, FaStore, FaMusic, FaCheck } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const EntitySelectorModal = ({ isOpen, onClose, onSelect, onOpenCreate, type, initialProvincia, initialCiudad }) => {
    const [provincia, setProvincia] = useState(initialProvincia || '');
    const [ciudad, setCiudad] = useState(initialCiudad || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setProvincia(initialProvincia || '');
            setCiudad(initialCiudad || '');
            buscarEntidades();
        }
    }, [isOpen, initialProvincia, initialCiudad]);

    useEffect(() => {
        buscarEntidades();
    }, [provincia, ciudad, searchTerm]);

    const buscarEntidades = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('entidades')
                .select('*')
                .eq('tipo_entidad', type)
                .order('nombre', { ascending: true });

            if (provincia) query = query.eq('provincia', provincia);
            if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`);
            if (searchTerm) query = query.ilike('nombre', `%${searchTerm}%`);

            const { data, error } = await query.limit(20);
            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error('Error buscando entidades:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-mo-sage/5 to-transparent">
                    <div>
                        <h2 className="text-xl font-black text-mo-text dark:text-white flex items-center gap-2">
                            {type === 'local' ? <FaStore className="text-mo-olive" /> : <FaMusic className="text-mo-olive" />}
                            Seleccionar {type === 'local' ? 'Local' : 'Amenizador'}
                        </h2>
                        <p className="text-[10px] text-mo-muted uppercase tracking-widest font-bold mt-1">
                            {provincia || 'Todas las provincias'} {ciudad && `· ${ciudad}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaTimes className="text-mo-muted" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Buscador */}
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-mo-muted opacity-50" />
                        <input
                            type="text"
                            placeholder={`Buscar por nombre de ${type}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none text-sm dark:text-white border border-transparent focus:border-mo-sage transition-all"
                        />
                    </div>

                    {/* Resultados */}
                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {loading && results.length === 0 ? (
                            <div className="py-10 text-center animate-pulse">
                                <div className="text-mo-sage/20 text-4xl mb-2">🔍</div>
                                <p className="text-xs text-mo-muted font-bold">Buscando...</p>
                            </div>
                        ) : results.length > 0 ? (
                            results.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-mo-sage/5 border border-transparent hover:border-mo-sage/20 transition-all text-left group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mo-sage group-hover:scale-110 transition-transform overflow-hidden border border-gray-100 dark:border-gray-600">
                                        {item.avatar_url ? (
                                            <img src={item.avatar_url} alt={item.nombre} className="w-full h-full object-cover" />
                                        ) : (
                                            type === 'local' ? <FaStore /> : <FaMusic />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-mo-text dark:text-white truncate uppercase text-sm tracking-tight">
                                            {item.nombre}
                                        </h4>
                                        <p className="text-[10px] text-mo-muted truncate">
                                            {item.calle || item.ciudad} {item.ciudad && `(${item.provincia})`}
                                        </p>
                                    </div>
                                    <FaCheck className="text-mo-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))
                        ) : (
                            <div className="py-10 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-mo-muted font-bold px-4">No se han encontrado resultados en esta ubicación.</p>
                                <p className="text-[10px] text-mo-muted/60 mt-1">Prueba a registrarlo como nuevo.</p>
                            </div>
                        )}
                    </div>

                    {/* Botón Añadir Nuevo */}
                    <button
                        onClick={() => {
                            onOpenCreate({ provincia, ciudad });
                            onClose();
                        }}
                        className="w-full py-4 bg-mo-sage text-white rounded-2xl font-bold shadow-lg hover:bg-mo-olive transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                        <FaPlus />
                        Registrar Nuevo {type === 'local' ? 'Local' : 'Artista'}
                    </button>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                    .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                    .animate-slide-up { animation: slideUp 0.3s ease-out; }
                `}</style>
            </div>
        </div>
    );
};

export default EntitySelectorModal;
