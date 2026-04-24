
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listCategories() {
    const { data, error } = await supabase.from('categorias').select('*');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

listCategories();
