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
        
        results.push('nombre,provincia_id,cp_prefijo');

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length < 4) continue;

            const rawNombre = cols[2]?.replace(/"/g, '').trim();
            const provId = cols[0]?.padStart(2, '0');
            
            if (rawNombre && provId) {
                results.push(`"${rawNombre}","${provId}","${provId}"`);
            }
        }

        const uniqueResults = [...new Set(results)];
        fs.writeFileSync('municipios_espana.csv', uniqueResults.join('\n'));
        console.log('✅ ¡Hecho! Se ha creado el archivo: municipios_espana.csv');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
