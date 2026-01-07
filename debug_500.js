import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debug500() {
    const userId = '54720172-ace0-4596-a1ab-64fe9625d237';
    console.log(`🔍 Intentando debuggear Error 500 para usuario: ${userId}`);

    // 1. Probar select *
    console.log('\n--- Test 1: select(*) ---');
    const { data: d1, error: e1 } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

    if (e1) console.error('❌ Error select(*):', e1);
    else console.log('✅ select(*) exitoso:', d1);

    // 2. Probar columnas específicas
    console.log('\n--- Test 2: select(id, email, nombre_usuario) ---');
    const { data: d2, error: e2 } = await supabase
        .from('usuarios')
        .select('id, email, nombre_usuario')
        .eq('id', userId)
        .single();

    if (e2) console.error('❌ Error select específico:', e2);
    else console.log('✅ select específico exitoso:', d2);
}

debug500();
