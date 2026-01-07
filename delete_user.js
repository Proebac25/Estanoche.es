import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const userIdToDelete = '533eec86-1b5d-40ef-89dc-860f88839ab3'; // ID del usuario duplicado

async function deleteUser() {
    console.log(`🗑️ Intentando eliminar usuario: ${userIdToDelete}`);

    const { data, error } = await supabase.auth.admin.deleteUser(userIdToDelete);

    if (error) {
        console.error('❌ Error eliminando usuario:', error);
        return;
    }

    console.log('✅ Usuario eliminado correctamente.');
    // Verificar
    const { data: check, error: checkError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', userIdToDelete)
        .single();

    if (!check) {
        console.log('✅ Confirmado: El usuario ya no existe en la tabla usuarios.');
    } else {
        console.warn('⚠️ El usuario aún parece existir en la tabla pública (quizás los triggers tardan).');
    }
}

deleteUser();
