import { Resend } from 'resend';

const resend = new Resend('re_b8wL874o_8VNwRKf4ysBPSg3Fp9GpwGU6');

// Almacenamiento temporal en memoria (como bancos)
const verificationCodes = new Map();

// Limpiar códigos expirados cada hora
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(email);
    }
  }
  console.log(`Códigos limpiados. Restantes: ${verificationCodes.size}`);
}, 60 * 60 * 1000);

export default async function handler(req, res) {
  // SOPORTAR CORS si frontend en diferente puerto
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email } = req.body;
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email válido requerido' });
    }

    // Generar código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

    // Guardar en memoria (sobrescribe si ya existe)
    verificationCodes.set(email, {
      code: verificationCode,
      expiresAt,
      attempts: 0
    });

    console.log(`📧 Código para ${email}: ${verificationCode} (expira: ${new Date(expiresAt).toLocaleTimeString()})`);

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: 'EstaNoche <onboarding@resend.dev>',
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

    if (error) {
      console.error('❌ Error Resend:', error);
      verificationCodes.delete(email);
      return res.status(500).json({ error: 'Error enviando email de verificación' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email de verificación enviado'
    });

  } catch (error) {
    console.error('❌ Error en send-verification:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}