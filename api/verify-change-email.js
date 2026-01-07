import supabaseAdmin from './_lib/supabase-admin.js';

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
        const { email, code, userId } = req.body; // 'email' es el NUEVO email

        if (!email || !code || !userId) {
            return res.status(400).json({ success: false, error: 'Datos incompletos' });
        }

        if (!supabaseAdmin) {
            return res.status(500).json({ error: 'Configuración de servidor incompleta (BD)' });
        }

        // 1. Buscar código en Base de Datos
        const { data: storedData, error: dbFetchError } = await supabaseAdmin
            .from('verification_codes')
            .select('*')
            .eq('email', email)
            .single();

        if (dbFetchError || !storedData) {
            return res.status(400).json({ success: false, error: 'Código no encontrado o expirado.' });
        }

        const now = Date.now();

        // 2. Validaciones
        if (now > storedData.expires_at) {
            await supabaseAdmin.from('verification_codes').delete().eq('email', email);
            return res.status(400).json({ success: false, error: 'El código ha expirado.' });
        }

        if (storedData.code !== code) {
            const newAttempts = (storedData.attempts || 0) + 1;
            if (newAttempts >= 5) {
                await supabaseAdmin.from('verification_codes').delete().eq('email', email);
                return res.status(400).json({ success: false, error: 'Demasiados intentos fallidos.' });
            }
            await supabaseAdmin
                .from('verification_codes')
                .update({ attempts: newAttempts })
                .eq('email', email);
            return res.status(400).json({ success: false, error: `Código incorrecto.` });
        }

        // --- CÓDIGO VALIDO, PROCEDER CON ACTUALIZACIÓN ---
        console.log(`🔄 Actualizando email para usuario ${userId} a: ${email}`);

        // 1. Actualizar Auth (Login email)
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email: email, email_confirm: true }
        );

        if (authError) {
            console.error('❌ Error actualizando Auth:', authError);
            return res.status(500).json({ error: authError.message });
        }

        // 2. Actualizar tabla public.usuarios
        await supabaseAdmin
            .from('usuarios')
            .update({ email: email })
            .eq('id', userId);

        // Limpiar código usado
        await supabaseAdmin.from('verification_codes').delete().eq('email', email);

        return res.status(200).json({
            success: true,
            message: 'Email actualizado correctamente',
            newEmail: email
        });

    } catch (error) {
        console.error('❌ Error en verify-change-email:', error);
        return res.status(500).json({ error: error.message });
    }
}
