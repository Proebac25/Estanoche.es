
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function forceColumnList() {
    const { error } = await supabase.from('eventos').select('get_all_columns_forced_error').limit(1);
    console.log('Columns hint:', error ? error.message : 'No error');
}

forceColumnList();
