import { Resend } from 'resend';

const resend = new Resend('re_b8wL874o_8VNwRKf4ysBPSg3Fp9GpwGU6');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // Generar código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Aquí deberías guardar el código temporalmente (ej: en memoria, Redis, etc.)
    // Por ahora solo lo devolvemos para testing
    console.log(`Código para ${email}: ${verificationCode}`);

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: 'EstaNoche <onboarding@resend.dev>', // Cambiar cuando tengas dominio
      to: email,
      subject: 'Tu código de verificación - EstaNoche',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4B744D;">Verifica tu email</h2>
          <p>Usa el siguiente código para completar tu registro en EstaNoche:</p>
          <div style="background-color: #f4f1ee; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 10px; color: #1E2933;">${verificationCode}</h1>
          </div>
          <p style="color: #64748B; font-size: 14px;">
            Este código expira en 15 minutos. Si no solicitaste este código, ignora este email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error enviando email:', error);
      return res.status(500).json({ error: 'Error enviando email de verificación' });
    }

    // En producción, guardar código en DB/Redis con expiry
    // Por ahora devolvemos el código para testing (en producción NO hacer esto)
    return res.status(200).json({ 
      success: true, 
      message: 'Email enviado',
      code: verificationCode // ⚠️ SOLO PARA TESTING - quitar en producción
    });

  } catch (error) {
    console.error('Error en send-verification:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}