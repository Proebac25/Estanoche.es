import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Load .env.local

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    console.log("URL:", process.env.VITE_SUPABASE_URL);
    // Intentaremos insertar una red social de prueba simulando ser el usuario actual, 
    // pero no tenemos el token del usuario fácilmente.
    // En su lugar, consultemos qué ocurre.
}

check();
