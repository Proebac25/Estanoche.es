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
            if (cols.length < 3) continue;

            const nombre = cols[2]?.replace(/"/g, '').trim(); // Nombre del municipio
            const provId = cols[0]?.padStart(2, '0'); // ID Provincia (ej: 01)
            
            if (nombre && provId) {
                // El prefijo del CP suele ser los dos primeros dígitos de la provincia + el tercero
                // Para simplificar, pondremos solo los dos primeros de la provincia
                results.push(`"${nombre}","${provId}","${provId}"`);
            }
        }

        fs.writeFileSync('municipios_espana.csv', results.join('\n'));
        console.log('✅ ¡Hecho! Se ha creado el archivo: municipios_espana.csv');
        console.log('Ahora puedes subirlo a Supabase (Import CSV) en la tabla municipios.');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
