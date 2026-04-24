import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Reemplazar la URL de conexión usando la de SUPABASE_URL pero adaptada para Postgres
// Es más fácil usar una variable directa si el usuario la tiene en el .env (por ejemplo DATABASE_URL)
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function updateTrigger() {
    console.log("Conectando a postgres...", process.env.DATABASE_URL ? "URL encontrada" : "URL por defecto");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        const sql = `
CREATE OR REPLACE FUNCTION registrar_o_actualizar_evento_analisis()
RETURNS TRIGGER AS $$
DECLARE
  v_nombre_entidad text;
  v_tipo_entidad text;
  v_entidad_ciudad text;
  v_entidad_provincia text;
  v_entidad_local_nombre text;
  v_entidad_amenizador_nombre text;
BEGIN
  -- 1. Obtener datos del Creador (Usuario)
  -- NOTA: NEW.creador_nombre ya viene directamente de la tabla eventos, no hace falta buscar en perfiles

  -- 2. Obtener datos de Entidad Organizadora Principal (si la hay)
  IF NEW.entidad_id IS NOT NULL THEN
    SELECT nombre, tipo_entidad, ciudad, provincia
    INTO v_nombre_entidad, v_tipo_entidad, v_entidad_ciudad, v_entidad_provincia
    FROM entidades WHERE id = NEW.entidad_id;
  END IF;

  -- 3. Obtener nombres de Local y Amenizador (si están vinculados)
  IF NEW.entidad_local_id IS NOT NULL THEN
    SELECT nombre INTO v_entidad_local_nombre
    FROM entidades WHERE id = NEW.entidad_local_id;
  END IF;

  IF NEW.entidad_amenizador_id IS NOT NULL THEN
    SELECT nombre INTO v_entidad_amenizador_nombre
    FROM entidades WHERE id = NEW.entidad_amenizador_id;
  END IF;

  -- 4. Inserción o Actualización en eventos_analisis
  IF TG_OP = 'INSERT' THEN
    INSERT INTO eventos_analisis (
      id, titulo, tipo, fecha_inicio, fecha_fin, estado, visibilidad, 
      entidad_id, entidad_nombre, tipo_entidad, 
      entidad_local_id, entidad_local_nombre, 
      entidad_amenizador_id, entidad_amenizador_nombre,
      creador_id, creador_nombre, app_origen,
      entidad_ciudad, entidad_provincia, lugar_manual, ubicacion
    ) VALUES (
      NEW.id, NEW.titulo, NEW.tipo, NEW.fecha_inicio, NEW.fecha_fin, NEW.estado, NEW.visibilidad,
      NEW.entidad_id, v_nombre_entidad, v_tipo_entidad,
      NEW.entidad_local_id, v_entidad_local_nombre,
      NEW.entidad_amenizador_id, v_entidad_amenizador_nombre,
      NEW.creador_id, NEW.creador_nombre, NEW.app_origen,
      v_entidad_ciudad, v_entidad_provincia, NEW.lugar_manual, NEW.ubicacion
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE eventos_analisis SET
      titulo = NEW.titulo,
      tipo = NEW.tipo,
      fecha_inicio = NEW.fecha_inicio,
      fecha_fin = NEW.fecha_fin,
      estado = NEW.estado,
      visibilidad = NEW.visibilidad,
      entidad_id = NEW.entidad_id,
      entidad_nombre = v_nombre_entidad,
      tipo_entidad = v_tipo_entidad,
      entidad_local_id = NEW.entidad_local_id,
      entidad_local_nombre = v_entidad_local_nombre,
      entidad_amenizador_id = NEW.entidad_amenizador_id,
      entidad_amenizador_nombre = v_entidad_amenizador_nombre,
      creador_id = NEW.creador_id,
      creador_nombre = NEW.creador_nombre,
      app_origen = NEW.app_origen,
      entidad_ciudad = v_entidad_ciudad,
      entidad_provincia = v_entidad_provincia,
      lugar_manual = NEW.lugar_manual,
      ubicacion = NEW.ubicacion
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
        `;
        
        await client.query(sql);
        console.log("Trigger function updated successfully!");
    } catch (e) {
        console.error("Error al ejecutar SQL:", e.message);
    } finally {
        await client.end();
    }
}

updateTrigger();
