# Community Builders LATAM

Landing de presentación y formulario de ingreso a la comunidad. Está construida con Next.js App Router para mantener el contenido renderizado en servidor y facilitar SEO, con una experiencia scrollytelling en el recorrido principal.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). Si no existe `DATABASE_URL`, el formulario guarda temporalmente los registros en `.data/candidates.json` para poder probar el flujo completo sin infraestructura externa.

## Neon + Vercel

1. Crear una base PostgreSQL en Neon.
2. Ejecutar `db/001_init.sql` en el SQL Editor de Neon.
3. Copiar `DATABASE_URL` en las variables de entorno del proyecto de Vercel.
4. Publicar el proyecto. La API detecta `DATABASE_URL` y usa Neon automáticamente.

Las consultas de referencia están en `db/queries.sql`. El flujo está dividido en dos instancias: la primera guarda los datos básicos al confirmar Whatsapp; la segunda actualiza el registro con información complementaria opcional.

Si la tabla se creó con una versión anterior de la migración inicial, ejecutar también `db/002_optional_linkedin.sql` para permitir postulaciones sin LinkedIn.

## FALTA DEFINIR

- Dato random, guilty pleasure y fuera del trabajo de Fer.
- Validar el borrador de `/terminos` y completar el nombre y domicilio del responsable, además del plazo de conservación de los datos, antes de publicar.
- Dirección final de dominio y configuración DNS en Vercel.
