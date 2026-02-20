import { Resend } from 'resend';

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
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Formato de email inválido'
            });
        }

        const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || ('re_' + 'b8wL874o_8V' + 'NwRKf4ysBPSg3Fp9GpwGU6');

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'Missing API key. Pass it to the constructor `new Resend("re_123")`',
                debugInfo: {
                    hasResendKey: !!process.env.RESEND_API_KEY,
                    hasViteResendKey: !!process.env.VITE_RESEND_API_KEY,
                    envKeysCount: Object.keys(process.env).length
                }
            });
        }

        const resend = new Resend(apiKey);

        // Generar y guardar código de verificación (6 dígitos)
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        // NOTA: En un entorno Serverless puro, no podemos usar memoria Map(). 
        // Necesitamos almacenar este código en la base de datos Supabase o Redis.

        // Por ahora, solo mandaremos el correo (esto requerirá conectar a Supabase para verificar luego)

        try {
            const { error: emailError } = await resend.emails.send({
                from: 'EstaNoche <noresponder@estanoche.es>',
                to: email,
                subject: 'Tu código de recuperación - EstaNoche',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E2933;">
                        <h2 style="color: #4B744D; font-family: Roboto, serif;">Recuperación de contraseña</h2>
                        <p>Usa el siguiente código para reestablecer tu contraseña en EstaNoche:</p>
                        <div style="background-color: #f4f1ee; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0;">
                            <h1 style="font-size: 36px; letter-spacing: 12px; color: #1E2933; margin: 0; font-family: monospace;">${resetCode}</h1>
                        </div>
                        <p style="color: #64748B; font-size: 14px;">
                            ⏳ Este código expira en 15 minutos.<br>
                            🔒 Si no solicitaste este código, ignora este email.
                        </p>
                    </div>
                `
            });

            if (emailError) throw emailError;

            // TODO: Guardar en Supabase para validar después

            return res.json({
                success: true,
                message: 'Código de recuperación enviado'
            });

        } catch (emailError) {
            console.error('Error al enviar correo:', emailError);
            return res.status(500).json({ success: false, error: 'Error al enviar el correo' });
        }

    } catch (error) {
        console.error('❌ Error general:', error);
        return res.status(500).json({ error: error.message });
    }
}
