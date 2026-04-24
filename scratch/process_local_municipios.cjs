const fs = require('fs');
const path = require('path');

// Ruta al archivo descargado por el sistema
const sourcePath = 'C:\\Users\\Miguel García Durán\\.gemini\\antigravity\\brain\\d516f7c2-c2cf-48ff-9ae0-d79cd2893760\\.system_generated\\steps\\624\\content.md';
const destPath = 'd:\\ENE\\municipios_espana.csv';

try {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const lines = content.split('\n');
    
    const results = [];
    results.push('nombre,provincia_id,cp_prefijo');

    // El archivo tiene una cabecera de source en las primeras líneas
    // Buscamos dónde empieza la data real (municipio_id,provincia_id...)
    let dataStarted = false;
    for (let line of lines) {
        if (!dataStarted) {
            if (line.includes('municipio_id,provincia_id')) {
                dataStarted = true;
            }
            continue;
        }

        const cols = line.split(',');
        if (cols.length < 5) continue;

        // Formato: municipio_id, provincia_id, cmun, dc, nombre
        const nombre = cols.slice(4).join(',').replace(/"/g, '').trim(); // Maneja nombres con comas
        const provId = cols[1]?.trim();

        if (nombre && provId) {
            results.push(`"${nombre}","${provId}","${provId}"`);
        }
    }

    fs.writeFileSync(destPath, results.join('\n'));
    console.log(`✅ ¡Archivo procesado! ${results.length - 1} municipios guardados.`);
} catch (err) {
    console.error('Error procesando el archivo:', err);
}
