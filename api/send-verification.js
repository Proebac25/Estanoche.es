import { Resend } from 'resend';
import supabaseAdmin from './_lib/supabase-admin.js';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_b8wL874o_8VNwRKf4ysBPSg3Fp9GpwGU6');

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
        const { email, userData } = req.body;

        // Validación básica del email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Formato de email inválido'
            });
        }

        if (!supabaseAdmin) {
            return res.status(500).json({ error: 'Configuración de servidor incompleta (BD)' });
        }

        // 1. Generar código
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos en milisegundos

        // 2. Guardar en Base de Datos (Supabase) en lugar de memoria RAM
        // Usamos 'upsert' por si ya existe un código previo para ese email
        const { error: dbError } = await supabaseAdmin
            .from('verification_codes')
            .upsert({
                email: email,
                code: verificationCode,
                expires_at: expiresAt,
                attempts: 0,
                user_data: userData || {},
                created_at: new Date().toISOString()
            });

        if (dbError) {
            console.error('❌ Error guardando código en BD:', dbError);
            return res.status(500).json({ error: 'Error guardando código de verificación' });
        }

        // 3. Enviar correo de verificación con Resend
        const { data, error: emailError } = await resend.emails.send({
            from: 'EstaNoche <noresponder@estanoche.es>',
            to: email,
            subject: 'Tu código de verificación - EstaNoche',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E2933;">
          <h2 style="color: #4B744D; font-family: Roboto, serif;">Verifica tu email</h2>
          <p>Usa el siguiente código para completar tu registro en EstaNoche:</p>
          <div style="background-color: #f4f1ee; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h1 style="font-size: 36px; letter-spacing: 12px; color: #1E2933; margin: 0; font-family: monospace;">${verificationCode}</h1>
          </div>
          <p style="color: #64748B; font-size: 14px;">
            ⏳ Este código expira en 15 minutos.<br>
            🔒 Si no solicitaste este código, ignora este email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          <p style="color: #94A3B8; font-size: 12px;">
            EstaNoche · Agenda de ocio nocturno
          </p>
        </div>
      `,
            text: `Tu código de verificación EstaNoche es: ${verificationCode}. Expira en 15 minutos.`
        });

        if (emailError) {
            console.error('❌ Error enviando email:', emailError);
            return res.status(500).json({ error: 'Error enviando el correo' });
        }

        console.log(`✅ Código enviado a ${email} (Persistido en BD)`);
        return res.status(200).json({
            success: true,
            message: 'Código enviado correctamente'
        });

    } catch (error) {
        console.error('❌ Excepción en send-verification:', error);
        return res.status(500).json({ error: error.message });
    }
}
