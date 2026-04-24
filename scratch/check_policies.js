import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Load .env from parent directory

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function checkPolicies() {
    console.log("Conectando a postgres...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        const sql = `
            SELECT * FROM pg_policies WHERE tablename = 'eventos_analisis';
        `;
        
        const res = await client.query(sql);
        console.table(res.rows);
    } catch (e) {
        console.error("Error al ejecutar SQL:", e.message);
    } finally {
        await client.end();
    }
}

checkPolicies();
