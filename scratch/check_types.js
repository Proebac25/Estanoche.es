
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTypes() {
    const { data, error } = await supabase.from('entidades').select('ciudad').limit(1);
    if (data && data.length > 0) {
        console.log('Ciudad in entidades:', typeof data[0].ciudad, data[0].ciudad);
    }
}

checkTypes();
