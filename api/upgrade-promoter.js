import supabaseAdmin from './_lib/supabase-admin.js';

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'ID de usuario es requerido' });
        }

        if (!supabaseAdmin) {
            return res.status(500).json({ error: 'Configuración de servidor incompleta (BD)' });
        }

        const { data, error } = await supabaseAdmin
            .from('usuarios')
            .update({
                tipo: 'promotor',
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('❌ Error en upgrade-promoter:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error('❌ Error en upgrade-promoter:', error);
        return res.status(500).json({ error: error.message });
    }
}
