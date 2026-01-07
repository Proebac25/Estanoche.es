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
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, error: 'Email y código son requeridos' });
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
            // Borrar expirado
            await supabaseAdmin.from('verification_codes').delete().eq('email', email);
            return res.status(400).json({ success: false, error: 'El código ha expirado.' });
        }

        if (storedData.code !== code) {
            // Incrementar intentos
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

        // --- CÓDIGO VERIFICADO EXITOSAMENTE ---
        const userData = storedData.user_data || {};
        let userId = null;

        try {
            console.log(`👤 Creando usuario en Supabase para: ${email}`);

            // Crear usuario en Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: userData.email || email,
                password: userData.password,
                email_confirm: true,
                user_metadata: {
                    nombre_usuario: userData.nombre_usuario,
                    nombre: userData.nombre,
                    apellidos: userData.apellidos,
                    telefono: userData.telefono,
                    tipo_usuario: userData.tipo_usuario
                }
            });

            if (authError) throw authError;
            userId = authData.user.id;
            console.log('✅ Usuario creado en Supabase Auth con ID:', userId);

        } catch (dbError) {
            console.error('❌ Error al crear usuario en Supabase:', dbError);
            return res.status(500).json({
                success: false,
                error: 'Error al registrar usuario en base de datos: ' + dbError.message
            });
        }

        // Limpiar código usado de la BD
        await supabaseAdmin.from('verification_codes').delete().eq('email', email);

        // Responder
        return res.status(200).json({
            success: true,
            message: 'Usuario verificado y registrado correctamente',
            tipo: userData.tipo_usuario || 'cliente',
            userId: userId,
            userData: { ...userData, id: userId }
        });

    } catch (error) {
        console.error('❌ Error en verify-code:', error);
        return res.status(500).json({ error: error.message });
    }
}
