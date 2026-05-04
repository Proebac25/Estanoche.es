import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkRedes() {
    // get latest event
    const { data: events } = await supabase.from('eventos').select('*').order('created_at', { ascending: false }).limit(1);
    const event = events[0];
    console.log("Last Event:", event.id, event.titulo);

    // check redes
    const { data: redes, error } = await supabase.from('redes_sociales').select('*').in('propietario_id', [event.id, event.entidad_id, event.creador_id].filter(Boolean));
    console.log("Redes for this event:", redes);
}

checkRedes();
