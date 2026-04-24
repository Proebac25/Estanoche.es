
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findEnums() {
    // Intentamos obtener los valores de un campo enum forzando un error de cast o similar
    // Pero es más fácil intentar un insert y ver el error de 'invalid input value for enum'
    const { error } = await supabase.from('eventos').insert({ 
        creador_id: '00000000-0000-0000-0000-000000000000',
        titulo: 'Probe',
        descripcion: 'Probe',
        ciudad: 'Madrid',
        ubicacion: 'Calle',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        precio_actual: '0',
        tipo: 'invalid_enum_value',
        visibilidad: 'invalid_enum_value',
        app_origen: 'invalid_enum_value',
        estado: 'invalid_enum_value'
    }).select();
    
    console.log('Enum Error Hint:', error ? error.message : 'No error');
}

findEnums();
