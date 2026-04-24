
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addJamSession() {
    const { data, error } = await supabase.from('categorias').insert([
        { 
            nombre: 'JAM Session', 
            icono_emoji: '🎷', 
            icono: 'FaMusic', 
            app: 'ambas', 
            activo: true, 
            orden: 0,
            visible_creador: true
        }
    ]);
    if (error) console.error(error);
    else console.log('Categoría JAM Session añadida!');
}

addJamSession();
