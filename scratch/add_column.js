
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumn() {
    console.log('Attempting to add column google_maps_url to entidades...');
    // In Supabase, we can use the SQL Editor, but here we'll try a common trick:
    // Some projects have a 'exec_sql' RPC.
    const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: "ALTER TABLE entidades ADD COLUMN IF NOT EXISTS google_maps_url text;" 
    });

    if (error) {
        console.error('RPC exec_sql failed or column already exists:', error.message);
    } else {
        console.log('Success:', data);
    }
}

addColumn();
