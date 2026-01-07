import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRecentUsers() {
    console.log('🔍 Buscando usuarios recientes...');

    const { data: users, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre_usuario, created_at, tipo')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        return;
    }

    console.log('📋 Últimos 5 usuarios registrados:');
    users.forEach((u, index) => {
        console.log(`${index + 1}. [${u.created_at}] ID: ${u.id} | Email: ${u.email} | Usuario: ${u.nombre_usuario} | Tipo: ${u.tipo}`);
    });
}

listRecentUsers();
