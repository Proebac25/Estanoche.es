
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function probeAudit() {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const { error } = await supabase.from('eventos').insert({ 
        creador_id: fakeId,
        titulo: 'Probe',
        creador_nombre: 'Test'
    }).select();
    console.log('Error with creador_nombre:', error ? error.message : 'No error');
}

probeAudit();
