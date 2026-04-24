const fs = require('fs');
const https = require('https');

// Fuente: Repositorio curado con datos del INE
const url = 'https://raw.githubusercontent.com/inigoflores/ds-municipios-catastro-es/master/data/municipios.csv';

console.log('Descargando municipios desde GitHub...');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const lines = data.split('\n');
        const results = [];
        
        // Cabecera del CSV para Supabase
        results.push('nombre,provincia_id,cp_prefijo');

        // Procesar líneas (saltamos la cabecera del original)
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length < 4) continue;

            // En este CSV el formato es: codigo_provincia, codigo_municipio, nombre
            const rawNombre = cols[2]?.replace(/"/g, '').trim();
            const provId = cols[0]?.padStart(2, '0');
            
            if (rawNombre && provId) {
                // Limpieza básica de nombres (quitar artículos al final si es necesario, etc)
                // Por ahora lo dejamos tal cual viene del INE
                results.push(`"${rawNombre}","${provId}","${provId}"`);
            }
        }

        // Eliminar duplicados si los hay
        const uniqueResults = [...new Set(results)];

        fs.writeFileSync('municipios_espana.csv', uniqueResults.join('\n'));
        console.log('✅ ¡Hecho! Se ha creado el archivo: municipios_espana.csv');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
