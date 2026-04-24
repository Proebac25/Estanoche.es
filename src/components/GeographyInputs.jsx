import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const GeographyInputs = ({ 
    provinciaValue, 
    municipioValue, 
    cpValue = "",
    onChange, 
    className = "",
    required = false,
    hideCp = false
}) => {
    const [provincias, setProvincias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cpError, setCpError] = useState('');

    useEffect(() => {
        const fetchProvincias = async () => {
            const { data, error } = await supabase
                .from('provincias')
                .select('id, nombre')
                .order('nombre', { ascending: true });
            
            if (!error && data) {
                setProvincias(data);
            }
        };
        fetchProvincias();
    }, []);

    useEffect(() => {
        const fetchMunicipios = async () => {
            if (!provinciaValue) {
                setMunicipios([]);
                return;
            }

            setIsLoading(true);
            try {
                const prov = provincias.find(p => p.nombre === provinciaValue);
                if (!prov) return;

                const { data, error } = await supabase
                    .from('municipios')
                    .select('nombre, cp_prefijo')
                    .eq('provincia_id', prov.id)
                    .order('nombre', { ascending: true });

                if (!error && data) {
                    setMunicipios(data);
                }
            } catch (err) {
                console.error('Error cargando municipios:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (provincias.length > 0) {
            fetchMunicipios();
        }
    }, [provinciaValue, provincias]);

    // Validación de CP
    useEffect(() => {
        if (!cpValue || !provinciaValue || provincias.length === 0) {
            setCpError('');
            return;
        }

        const prov = provincias.find(p => p.nombre === provinciaValue);
        if (prov) {
            // El ID ya viene como texto de 2 dígitos (ej: "01", "28")
            const prefix = prov.id; 
            if (cpValue.length >= 2 && cpValue.slice(0, 2) !== prefix) {
                setCpError(`El CP no corresponde a ${provinciaValue} (debe empezar por ${prefix})`);
            } else {
                setCpError('');
            }
        }
    }, [cpValue, provinciaValue, provincias]);

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-mo-muted mb-1 ml-2">Provincia {required && '*'}</label>
                    <select
                        name="provincia"
                        value={provinciaValue}
                        onChange={(e) => onChange({ target: { name: 'provincia', value: e.target.value } })}
                        className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl outline-none text-sm dark:text-white border border-gray-100 dark:border-gray-700 shadow-sm transition-all focus:border-mo-sage"
                        required={required}
                    >
                        <option value="">-- Selecciona Provincia --</option>
                        {provincias.map(p => (
                            <option key={p.id} value={p.nombre}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-mo-muted mb-1 ml-2">Localidad / Ciudad {required && '*'}</label>
                    <div className="relative">
                        <input
                            list="municipios-list"
                            type="text"
                            name="ciudad"
                            value={municipioValue}
                            onChange={(e) => onChange({ target: { name: 'ciudad', value: e.target.value } })}
                            className={`w-full p-4 bg-white dark:bg-gray-800 rounded-2xl outline-none text-sm dark:text-white border border-gray-100 dark:border-gray-700 shadow-sm transition-all focus:border-mo-sage ${isLoading ? 'opacity-50' : ''}`}
                            placeholder={provinciaValue ? "Escribe o selecciona..." : "Primero elige provincia"}
                            required={required}
                            autoComplete="off"
                        />
                        <datalist id="municipios-list">
                            {municipios.map((m, idx) => (
                                <option key={`${m.nombre}-${idx}`} value={m.nombre}>
                                    {m.cp_prefijo ? `${m.nombre} (${m.cp_prefijo}...)` : m.nombre}
                                </option>
                            ))}
                        </datalist>
                        {isLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-mo-sage border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!hideCp && (
                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-mo-muted mb-1 ml-2">Código Postal</label>
                    <input
                        type="text"
                        name="codigo_postal"
                        value={cpValue}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                            onChange({ target: { name: 'codigo_postal', value: val } });
                        }}
                        className={`w-1/3 p-4 bg-white dark:bg-gray-800 rounded-2xl outline-none text-sm dark:text-white border shadow-sm transition-all focus:border-mo-sage ${cpError ? 'border-red-400 bg-red-50/10' : 'border-gray-100 dark:border-gray-700'}`}
                        placeholder="Ej: 28001"
                        maxLength="5"
                    />
                    {cpError && (
                        <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold animate-pulse">
                            ⚠️ {cpError}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeographyInputs;
