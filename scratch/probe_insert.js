
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findCityType() {
    // Intentamos un insert con una ciudad y vemos si falla
    const { error } = await supabase.from('eventos').insert({ 
        creador_id: '00000000-0000-0000-0000-000000000000',
        titulo: 'Probe',
        descripcion: 'Probe',
        ciudad: 'Madrid',
        ubicacion: 'Calle',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        precio_actual: '0',
        tipo: 'concierto',
        visibilidad: 'publico',
        app_origen: 'web',
        estado: 'activo'
    }).select();
    
    console.log('Insert Error:', error ? error.message : 'No error');
}

findCityType();
