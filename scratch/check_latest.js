import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkLatestEvent() {
    const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
    
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(JSON.stringify(data[0], null, 2));
    }
}

checkLatestEvent();
