import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import multer from 'multer';

// Inicialización
const app = express();
const verificationCodes = new Map();

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_b8wL874o_8VNwRKf4ysBPSg3Fp9GpwGU6');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Limpiar códigos expirados cada hora
setInterval(() => {
  const now = Date.now();
  let expiredCount = 0;

  for (const [email, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(email);
      expiredCount++;
    }
  }

  if (expiredCount > 0) {
    console.log(`🧹 Limpiados ${expiredCount} códigos expirados`);
  }
}, 60 * 60 * 1000);

/**
 * Envía un código de verificación
 * @route POST /api/send-verification
 * @param {string} email - Correo electrónico
 */
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // Validación básica del email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

    // 2. Generar y guardar código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos de validez

    // Almacenar userData junto con el código de verificación
    verificationCodes.set(email, {
      code: verificationCode,
      expiresAt,
      attempts: 0,
      userData: req.body.userData || {}  // Guardar userData recibido
    });

    // 3. Enviar correo de verificación
    try {
      const { data, error } = await resend.emails.send({
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

      if (error) {
        console.error('❌ Error al enviar correo:', error);
        verificationCodes.delete(email);
        return res.status(500).json({
          success: false,
          error: 'Error al enviar el correo de verificación',
          details: error.message
        });
      }

      console.log(`✅ Correo de verificación enviado a ${email}`);
      return res.json({
        success: true,
        message: 'Código de verificación enviado correctamente'
      });
    } catch (emailError) {
      console.error('❌ Error al enviar correo:', emailError);
      verificationCodes.delete(email);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el correo de verificación',
        details: emailError.message
      });
    }
  } catch (error) {
    console.error('❌ Error en send-verification:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// Importar createClient
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Admin de Supabase (con Service Role Key)
const supabaseUrl = process.env.SUPABASE_URL || 'https://grehdbulpfgtphrvemup.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;

if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('✅ Supabase Admin inicializado correctamente');

  // Inicializar Storage
  const initializeStorage = async () => {
    try {
      console.log('📦 Verificando bucket "avatars"...');
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

      if (listError) {
        console.error('❌ Error listando buckets:', listError);
        return;
      }

      const avatarsExists = buckets.find(b => b.name === 'avatars');

      if (!avatarsExists) {
        console.log('📦 Bucket "avatars" no encontrado. Creando...');
        const { data, error } = await supabaseAdmin.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 262144, // 256KB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

        if (error) {
          console.error('❌ Error creando bucket "avatars":', error);
        } else {
          console.log('✅ Bucket "avatars" creado correctamente.');
        }
      } else {
        console.log('📦 Bucket "avatars" ya existe.');
      }
    } catch (e) {
      console.error('❌ Excepción inicializando storage:', e);
    }
  };

  initializeStorage();

} else {
  console.warn('⚠️ ADVERTENCIA: No se encontró SUPABASE_SERVICE_ROLE_KEY. Los usuarios NO se guardarán en Supabase.');
}

/**
 * Verifica un código de verificación y crea el usuario
 * @route POST /api/verify-code
 */
app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email y código son requeridos'
      });
    }

    // Verificar el código de verificación
    const storedData = verificationCodes.get(email);
    const now = Date.now();

    if (!storedData) { // ... resto de validaciones igual ...
      return res.status(400).json({ success: false, error: 'Código no encontrado o expirado.' });
    }
    if (now > storedData.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, error: 'El código ha expirado.' });
    }
    if (storedData.code !== code) {
      storedData.attempts += 1;
      if (storedData.attempts >= 5) {
        verificationCodes.delete(email);
        return res.status(400).json({ success: false, error: 'Demasiados intentos fallidos.' });
      }
      return res.status(400).json({ success: false, error: `Código incorrecto.` });
    }

    // --- CÓDIGO VERIFICADO EXITOSAMENTE ---
    const { userData } = storedData;
    console.log('📦 Verificando código. UserData recuperado:', JSON.stringify(userData, null, 2));

    // DETERMINAR TIPO REAL (Salvaguarda)
    const tipoReal = (userData.es_promotor_pendiente || userData.esPromotor) ? 'cliente' : (userData.tipo_usuario || 'cliente');

    let userId = null; // ID de Supabase

    // 1. Crear usuario en Supabase (si tenemos credenciales)
    if (supabaseAdmin) {
      try {
        console.log(`👤 Creando usuario en Supabase para: ${email}`);

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, // ¡Importante! El email ya está verificado por nosotros
          user_metadata: {
            nombre_usuario: userData.nombre_usuario,
            nombre: userData.nombre,
            apellidos: userData.apellidos,
            telefono: userData.telefono,
            // SALVAGUARDA: Si es promotor pendiente, FORZAR 'cliente' en la creación.
            tipo_usuario: tipoReal
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
    } else {
      console.log('⚠️ Saltando creación en BBDD (Falta Service Key)');
    }

    // Limpiar código usado
    verificationCodes.delete(email);

    // Responder al cliente con el TIPO REAL
    return res.json({
      success: true,
      message: 'Usuario verificado y registrado correctamente',
      tipo: tipoReal, // <--- RECTIFICADO
      id: userId, // Legacy support
      userId: userId, // ID real de Supabase
      userData: { ...userData, id: userId, tipo: tipoReal, tipo_usuario: tipoReal } // Añadir ID y TIPO corregido
    });

  } catch (error) {
    console.error('❌ Error en verify-code:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno'
    });
  }
});

/**
 * Verifica un código y ACTUALIZA el email de un usuario existente
 * @route POST /api/verify-change-email
 */
app.post('/api/verify-change-email', async (req, res) => {
  try {
    const { email, code, userId } = req.body; // 'email' es el NUEVO email

    if (!email || !code || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Email, código y userId son requeridos'
      });
    }

    // Verificar el código
    const storedData = verificationCodes.get(email);
    const now = Date.now();

    if (!storedData) {
      return res.status(400).json({ success: false, error: 'Código no encontrado o expirado.' });
    }
    if (now > storedData.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, error: 'El código ha expirado.' });
    }
    if (storedData.code !== code) {
      storedData.attempts += 1;
      if (storedData.attempts >= 5) {
        verificationCodes.delete(email);
        return res.status(400).json({ success: false, error: 'Demasiados intentos fallidos.' });
      }
      return res.status(400).json({ success: false, error: `Código incorrecto.` });
    }

    // --- CÓDIGO VALIDO, PROCEDER CON ACTUALIZACIÓN ---
    console.log(`🔄 Actualizando email para usuario ${userId} a: ${email}`);

    if (supabaseAdmin) {
      // 1. Actualizar Auth (Login email)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email: email, email_confirm: true }
      );

      if (authError) {
        console.error('❌ Error actualizando Auth:', authError);
        throw authError; // Rebotar error
      }

      console.log('✅ Email actualizado en Supabase Auth');

      // 2. Actualizar tabla public.usuarios (para mantener consistencia visual)
      const { error: dbError } = await supabaseAdmin
        .from('usuarios')
        .update({ email: email })
        .eq('id', userId);

      if (dbError) {
        console.error('⚠️ Error actualizando tabla usuarios (no crítico):', dbError);
      } else {
        console.log('✅ Email actualizado en tabla usuarios');
      }

    } else {
      console.warn('⚠️ No se pudo actualizar en Supabase (Falta Service Key)');
    }

    // Limpiar código usado
    verificationCodes.delete(email);

    return res.json({
      success: true,
      message: 'Email actualizado correctamente',
      newEmail: email
    });

  } catch (error) {
    console.error('❌ Error en verify-change-email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar email'
    });
  }
});

/**
 * Obtiene el perfil de un usuario (Bypass RLS)
 * @route GET /api/get-profile/:userId
 */
app.get('/api/get-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Servicio de base de datos no configurado'
      });
    }

    console.log(`🔍 Obteniendo perfil para usuario: ${userId}`);

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre_usuario, email, telefono, tipo, datos_negocio, updated_at, nombre, apellidos, avatar_url, calle, numero, ciudad, provincia, codigo_postal')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error en get-profile:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('❌ Error crítico en get-profile:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Actualiza el perfil de un usuario (Bypass RLS)
 * @route POST /api/update-profile
 */
app.post('/api/update-profile', async (req, res) => {
  try {
    // Manejar ambos formatos: { userId, updateData } o { userId, ...campos }
    let userId, updateData;

    if (req.body.updateData) {
      // Formato cliente: { userId, updateData }
      userId = req.body.userId;
      updateData = req.body.updateData;
    } else {
      // Formato promotor: { userId, ...campos }
      const { userId: id, ...rest } = req.body;
      userId = id;
      updateData = rest;
    }

    if (!userId || !updateData) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuario y datos de actualización son requeridos'
      });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Servicio de base de datos no configurado (Falta Service Key)'
      });
    }

    console.log(`📝 Actualizando perfil para usuario: ${userId}`);
    console.log(`📦 Datos a actualizar:`, JSON.stringify(updateData, null, 2));

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error en update-profile:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log('✅ Perfil actualizado exitosamente vía Backend');
    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('❌ Error crítico en update-profile:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Obtiene las redes sociales de un propietario (Bypass RLS)
 * @route GET /api/get-social-networks/:propietarioId/:tipoPropietario
 */
app.get('/api/get-social-networks/:propietarioId/:tipoPropietario', async (req, res) => {
  try {
    const { propietarioId, tipoPropietario } = req.params;

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Servicio de base de datos no configurado'
      });
    }

    console.log(`🔍 Obteniendo redes sociales para: ${propietarioId} (${tipoPropietario})`);

    const { data, error } = await supabaseAdmin
      .from('redes_sociales')
      .select('*')
      .eq('propietario_id', propietarioId)
      .eq('tipo_propietario', tipoPropietario)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error en get-social-networks:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`📊 Redes sociales encontradas: ${data?.length || 0}`);
    console.log('📦 Datos completos:', JSON.stringify(data, null, 2));

    return res.json({
      success: true,
      redes: data || []
    });

  } catch (error) {
    console.error('❌ Error crítico en get-social-networks:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Añade una red social (Bypass RLS)
 * @route POST /api/add-social-network
 */
app.post('/api/add-social-network', async (req, res) => {
  try {
    const { propietario_id, tipo_propietario, tipo_red, url, es_principal } = req.body;

    if (!propietario_id || !tipo_propietario || !tipo_red || !url) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos (propietario_id, tipo_propietario, tipo_red, url)'
      });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Servicio de base de datos no configurado'
      });
    }

    console.log(`➕ Añadiendo red social:`, { propietario_id, tipo_propietario, tipo_red, url });

    const redCompleta = {
      propietario_id,
      tipo_propietario,
      tipo_red,
      url,
      es_principal: es_principal || false,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('redes_sociales')
      .insert([redCompleta])
      .select()
      .single();

    if (error) {
      console.error('❌ Error en add-social-network:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log('✅ Red social añadida exitosamente vía Backend');
    return res.json({
      success: true,
      red: data
    });

  } catch (error) {
    console.error('❌ Error crítico en add-social-network:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Elimina una red social (Bypass RLS)
 * @route DELETE /api/delete-social-network/:redId
 */
app.delete('/api/delete-social-network/:redId', async (req, res) => {
  try {
    const { redId } = req.params;

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Servicio de base de datos no configurado'
      });
    }

    console.log(`🗑️ Eliminando red social ID: ${redId}`);

    const { error } = await supabaseAdmin
      .from('redes_sociales')
      .delete()
      .eq('id', redId);

    if (error) {
      console.error('❌ Error en delete-social-network:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log('✅ Red social eliminada exitosamente vía Backend');
    return res.json({
      success: true
    });

  } catch (error) {
    console.error('❌ Error crítico en delete-social-network:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Actualiza el tipo de usuario a 'promotor' (Bypass RLS)
 * @route POST /api/upgrade-promoter
 */
app.post('/api/upgrade-promoter', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuario es requerido'
      });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        error: 'Servicio de base de datos no configurado'
      });
    }

    console.log(`🚀 Mejorando a promotor al usuario: ${userId}`);

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
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log('✅ Usuario actualizado a promotor exitosamente vía Backend');
    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('❌ Error crítico en upgrade-promoter:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Envía código para BAJA de usuario
 * @route POST /api/send-delete-code
 */
app.post('/api/send-delete-code', async (req, res) => {
  try {
    const { email, userId } = req.body;

    if (!email || !userId) return res.status(400).json({ error: 'Email y ID requeridos' });

    // Generar código
    const deleteCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    // Guardar con prefijo especial para no colisionar con verificación normal
    verificationCodes.set(`DELETE:${email}`, {
      code: deleteCode,
      expiresAt,
      attempts: 0,
      userId
    });

    console.log(`⚠️ Generado código de BAJA para ${email}: ${deleteCode}`);

    // Enviar email
    const { error } = await resend.emails.send({
      from: 'EstaNoche <noresponder@estanoche.es>',
      to: email,
      subject: 'CÓDIGO DE SEGURIDAD: ELIMINAR CUENTA',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #DC2626; text-align: center;">ELIMINACIÓN DE CUENTA</h2>
          <p>Has solicitado eliminar tu cuenta. Este proceso es irreversible.</p>
          <div style="background-color: #FEF2F2; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 1px solid #FECACA;">
             <span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #DC2626;">${deleteCode}</span>
          </div>
          <p style="font-size: 12px; color: #666; text-align: center;">Si no has sido tú, cambia tu contraseña inmediatamente.</p>
        </div>
      `
    });

    if (error) throw error;

    res.json({ success: true, message: 'Código enviado' });

  } catch (error) {
    console.error('Error send-delete-code:', error);
    res.status(500).json({ error: 'Error al enviar email' });
  }
});

/**
 * Envía un código de recuperación de contraseña
 * @route POST /api/send-password-reset
 */
app.post('/api/send-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

    // Comprobar si el usuario existe en Supabase Auth
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Base de datos no configurada' });
    }

    // Buscamos el usuario en la tabla public.usuarios
    const { data: user, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    // Si no existe, no decimos nada por seguridad, solo fingimos que se envió
    if (userError || !user) {
      console.log(`[Seguridad] Intento de reset en email inexistente: ${email}`);
      return res.json({ success: true, message: 'Si el correo existe, recibirás un código' });
    }

    // Generar código de recuperación
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    // Guardar con prefijo especial
    verificationCodes.set(`RESET:${email}`, {
      code: resetCode,
      expiresAt,
      attempts: 0,
      userId: user.id
    });

    console.log(`🔑 Generado código RESET para ${email}: ${resetCode}`);

    // Enviar email
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

      return res.json({ success: true, message: 'Código de recuperación enviado' });
    } catch (emailError) {
      console.error('Error enviando código reset:', emailError);
      return res.status(500).json({ success: false, error: 'Error al enviar email' });
    }
  } catch (error) {
    console.error('Error send-password-reset:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * Verifica código y actualiza la contraseña
 * @route POST /api/reset-password
 */
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, código y nueva contraseña son requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar código
    const storedData = verificationCodes.get(`RESET:${email}`);
    const now = Date.now();

    if (!storedData) {
      return res.status(400).json({ success: false, error: 'Código no encontrado o expirado' });
    }

    if (now > storedData.expiresAt) {
      verificationCodes.delete(`RESET:${email}`);
      return res.status(400).json({ success: false, error: 'El código ha expirado' });
    }

    if (storedData.code !== code) {
      storedData.attempts += 1;
      if (storedData.attempts >= 5) {
        verificationCodes.delete(`RESET:${email}`);
        return res.status(400).json({ success: false, error: 'Demasiados intentos fallidos' });
      }
      return res.status(400).json({ success: false, error: 'Código incorrecto' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Base de datos no configurada' });
    }

    console.log(`🔐 Actualizando contraseña para: ${email} (ID: ${storedData.userId})`);

    // Actualizar contraseña en Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      storedData.userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error('❌ Error actualizando contraseña en Supabase:', updateError);
      return res.status(500).json({ success: false, error: 'Error al actualizar la contraseña' });
    }

    // Limpiar código
    verificationCodes.delete(`RESET:${email}`);

    console.log('✅ Contraseña actualizada con éxito');
    return res.json({ success: true, message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error reset-password:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * Confirma eliminación de usuario
 * @route POST /api/confirm-delete-user
 */
app.post('/api/confirm-delete-user', async (req, res) => {
  try {
    const { email, code, userId } = req.body;

    // Verificar código
    const stored = verificationCodes.get(`DELETE:${email}`);
    if (!stored || stored.code !== code) {
      return res.status(400).json({ error: 'Código incorrecto o expirado' });
    }

    if (!supabaseAdmin) return res.status(500).json({ error: 'Error de configuración servidor' });

    console.log(`🗑️ BORRANDO USUARIO: ${email} (${userId})`);

    // 0. Borrar redes sociales (enlaces únicos) explícitamente
    const { error: redesError } = await supabaseAdmin.from('redes_sociales').delete().eq('propietario_id', userId);
    if (redesError) console.warn('⚠️ Error borrando redes (puede que no tenga):', redesError);

    // 1. Borrar de public.usuarios
    const { error: dbError } = await supabaseAdmin.from('usuarios').delete().eq('id', userId);
    if (dbError) throw dbError;

    // 2. Borrar de Auth (Usuario real)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    verificationCodes.delete(`DELETE:${email}`);

    console.log('✅ Usuario eliminado correctamente');
    res.json({ success: true });

  } catch (error) {
    console.error('Error confirm-delete-user:', error);
    res.status(500).json({ error: error.message });
  }
});


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 256 * 1024 } // 256KB limit
});

// Endpoint para subir avatar
app.post('/api/upload-avatar', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req.body;

    if (!file || !userId) {
      return res.status(400).json({ success: false, error: 'Falta archivo o userId' });
    }

    console.log(`📤 Subiendo avatar para ${userId}...`);

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('❌ Error subiendo a Supabase:', error);
      throw error;
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(fileName);

    console.log('✅ Avatar subido:', publicUrlData.publicUrl);

    res.json({ success: true, publicUrl: publicUrlData.publicUrl });

  } catch (error) {
    console.error('❌ Error en upload-avatar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Envía código para RECUPERACIÓN de contraseña
 * @route POST /api/send-password-reset
 */
app.post('/api/send-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Email inválido' });
    }

    // Verificar que el usuario existe en la base de datos
    if (supabaseAdmin) {
      const { data: usuario, error: userError } = await supabaseAdmin
        .from('usuarios')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !usuario) {
        return res.status(404).json({
          success: false,
          error: 'Este email no está registrado en EstaNoche.es'
        });
      }
    }

    // Generar código de recuperación
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

    // Guardar con prefijo especial
    verificationCodes.set(`RESET:${email}`, {
      code: resetCode,
      expiresAt,
      attempts: 0
    });

    console.log(`🔑 Código de recuperación generado para ${email}: ${resetCode}`);

    // Enviar email con Resend
    const { error } = await resend.emails.send({
      from: 'EstaNoche <noresponder@estanoche.es>',
      to: email,
      subject: 'Recupera tu contraseña - EstaNoche',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E2933;">
          <h2 style="color: #4B744D; font-family: Roboto, serif;">Recuperación de Contraseña</h2>
          <p>Has solicitado recuperar tu contraseña. Usa el siguiente código:</p>
          <div style="background-color: #f4f1ee; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h1 style="font-size: 36px; letter-spacing: 12px; color: #1E2933; margin: 0; font-family: monospace;">${resetCode}</h1>
          </div>
          <p style="color: #64748B; font-size: 14px;">
            ⏳ Este código expira en 15 minutos.<br>
            🔒 Si no solicitaste recuperación, ignora este email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          <p style="color: #94A3B8; font-size: 12px;">
            EstaNoche · Agenda de ocio nocturno
          </p>
        </div>
      `,
      text: `Tu código de recuperación de contraseña es: ${resetCode}. Expira en 15 minutos.`
    });

    if (error) {
      console.error('❌ Error enviando email:', error);
      verificationCodes.delete(`RESET:${email}`);
      return res.status(500).json({ success: false, error: 'Error al enviar el email' });
    }

    console.log(`✅ Email de recuperación enviado a ${email}`);
    res.json({ success: true, message: 'Código enviado al email' });

  } catch (error) {
    console.error('❌ Error en send-password-reset:', error);
    res.status(500).json({ success: false, error: 'Error interno' });
  }
});

/**
 * Verifica código y actualiza contraseña
 * @route POST /api/reset-password
 */
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Faltan datos requeridos' });
    }

    // Validar contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar código
    const stored = verificationCodes.get(`RESET:${email}`);
    const now = Date.now();

    if (!stored) {
      return res.status(400).json({ success: false, error: 'Código no encontrado o expirado' });
    }

    if (now > stored.expiresAt) {
      verificationCodes.delete(`RESET:${email}`);
      return res.status(400).json({ success: false, error: 'El código ha expirado' });
    }

    if (stored.code !== code) {
      stored.attempts += 1;
      if (stored.attempts >= 5) {
        verificationCodes.delete(`RESET:${email}`);
        return res.status(400).json({ success: false, error: 'Demasiados intentos fallidos' });
      }
      return res.status(400).json({ success: false, error: 'Código incorrecto' });
    }

    // Código válido, actualizar contraseña en Supabase
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Servicio no configurado' });
    }

    // Buscar ID del usuario
    const { data: usuario, error: findError } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !usuario) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // Actualizar contraseña en Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      usuario.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('❌ Error actualizando password:', updateError);
      return res.status(500).json({ success: false, error: 'Error al actualizar contraseña' });
    }

    // Limpiar código usado
    verificationCodes.delete(`RESET:${email}`);

    console.log(`✅ Contraseña actualizada para ${email}`);
    res.json({ success: true, message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('❌ Error en reset-password:', error);
    res.status(500).json({ success: false, error: 'Error interno' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de verificación de correo ejecutándose en http://localhost:${PORT}`);
  console.log('📧 Endpoints disponibles:');
  console.log(`   • POST http://localhost:${PORT}/api/send-verification - Envía un código de verificación`);
  console.log(`   • POST http://localhost:${PORT}/api/verify-code - Verifica un código de verificación`);
  console.log(`   • POST http://localhost:${PORT}/api/verify-change-email - Verifica y actualiza el email`);
  console.log(`   • GET  http://localhost:${PORT}/api/get-profile/:userId - Obtiene perfil (Bypass RLS)`);
  console.log(`   • POST http://localhost:${PORT}/api/update-profile - Actualiza el perfil de usuario (Bypass RLS)`);
  console.log(`   • GET  http://localhost:${PORT}/api/get-social-networks/:propietarioId/:tipoPropietario - Obtiene redes sociales (Bypass RLS)`);
  console.log(`   • POST http://localhost:${PORT}/api/add-social-network - Añade red social (Bypass RLS)`);
  console.log(`   • DELETE http://localhost:${PORT}/api/delete-social-network/:redId - Elimina red social (Bypass RLS)`);
  console.log(`   • POST http://localhost:${PORT}/api/upgrade-promoter - Mejora cuenta a promotor (Bypass RLS)`);
  console.log(`   • POST http://localhost:${PORT}/api/send-delete-code - Envía código de baja de usuario`);
  console.log(`   • POST http://localhost:${PORT}/api/confirm-delete-user - Confirma baja de usuario`);
  console.log(`   • POST http://localhost:${PORT}/api/send-password-reset - Envía un código para recuperar contraseña`);
  console.log(`   • POST http://localhost:${PORT}/api/reset-password - Verifica código y establece nueva contraseña`);
  console.log('\n📧 Servicio de correo:', process.env.RESEND_API_KEY ? 'Resend configurado' : 'Usando clave de prueba');
});