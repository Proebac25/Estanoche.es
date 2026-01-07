import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://grehdbulpfgtphrvemup.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY en .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspect() {
    console.log('--- INSPECCIÓN DE DATOS ---');

    // 1. Usuarios (Tabla pública)
    console.log('\n📡 Consultando public.usuarios...');
    const { data: users, error: userError } = await supabase
        .from('usuarios')
        .select('id, nombre_usuario, email, tipo, datos_negocio, telefono')
        .limit(5);

    if (userError) {
        console.error('❌ Error usuarios:', userError.message);
    } else {
        if (!users || users.length === 0) console.log('⚠️ Tabla usuarios vacía.');
        else {
            console.log('✅ Usuarios encontrados:');
            users.forEach(u => {
                console.log(`\nID: ${u.id}`);
                console.log(`Email: ${u.email}`);
                console.log(`Root Name: ${u.nombre} ${u.apellidos}`);
                console.log(`Datos Negocio RAW:`, u.datos_negocio);
                console.log('-----------------------------------');
            });
        }
    }

    // 2. Categorías (Campo en entidades)
    console.log('\n📡 Consultando categorías en public.entidades...');
    const { data: entidades, error: entError } = await supabase
        .from('entidades')
        .select('categoria');

    if (entError) {
        console.error('❌ Error entidades:', entError.message);
    } else {
        if (!entidades || entidades.length === 0) {
            console.log('⚠️ Tabla entidades vacía (sin categorías).');
        } else {
            // Filtrar únicas y limpiar nulos
            const categorias = [...new Set(entidades.map(e => e.categoria).filter(c => c))];
            console.log('✅ Categorías encontradas:', categorias);
        }
    }
}

inspect();
