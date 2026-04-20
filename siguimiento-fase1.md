# Seguimiento Fase 1 - Proyecto COMENTARIOS

**Última actualización:** 2026-04-20

---

## Estado actual: EN PRODUCCIÓN EN VERCEL ⚠️

- **URL producción:** `https://comentarios-5moqpahpc-nelson-riveras-projects.vercel.app`
- **Último deploy exitoso:** 2025-12-19 (commit `b21b73d`)
- **Auto-deploy activo:** cada push a `main` va directo a producción
- **Firebase conectado:** usando variables de entorno en Vercel

---

### Lo que se terminó

- [x] Servidor Express con CORS y Morgan configurados
- [x] Configuración de Firebase Admin SDK (doble modo: archivo JSON + variables de entorno para Vercel)
- [x] Endpoint `POST /api/comments/:appId` — crear comentario en Firestore
- [x] Endpoint `GET /api/comments/:appId` — listar comentarios con paginación básica
- [x] Endpoint `GET /health` — health check
- [x] Sanitización de `appId` basada en subdominio/nombre
- [x] Soporte para deploy en Vercel mediante variables de entorno (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`)
- [x] Bug crítico corregido: `ReferenceError: path is not defined` en `firebase.js` (commit `b21b73d`)

---

## Por dónde hay que seguir

### 1. Habilitar filtro isVisible (BLOQUEADO por índice Firestore)
- **Archivo:** `src/controllers/comments.controller.js` línea 49
- **Tarea:** Crear índice compuesto en Firebase Console: colección `comments`, campos `isVisible ASC + createdAt DESC`
- Una vez creado el índice, descomentar la línea `.where('isVisible', '==', true)`

### 2. Completar paginación con cursor
- **Archivo:** `src/controllers/comments.controller.js` línea 46-56
- El parámetro `startAfter` está recibido pero no implementado
- Implementar paginación real usando `startAfter(docSnapshot)`

### 3. Agregar endpoints faltantes
- `PUT /api/comments/:appId/:commentId` — actualizar comentario
- `DELETE /api/comments/:appId/:commentId` — eliminar comentario (soft delete cambiando `isVisible: false`)

### 4. Limpiar código de debug
- **Archivo:** `src/config/firebase.js` líneas 5-7, 24, 34, 52 — remover `console.log` de debug
- Mover archivos `verify_*.js` y `debug_*.js` a carpeta `/scripts` o eliminar

### 5. Seguridad mínima (antes de producción)
- Cambiar respuestas de error 500 para no exponer `error.message` directamente
- Agregar autenticación (API key simple o JWT)
- Agregar rate limiting con `express-rate-limit`

### 6. Testing
- Crear suite de tests básicos con Jest o similar

---

## Notas técnicas

- Los archivos `run_log.txt` y `error.log` son **obsoletos** — muestran el error anterior ya corregido
- `firebase-credentials.json` está en la raíz — confirmar que está en `.gitignore` ✅
- Estructura Firestore: `apps/{appId}/comments/{commentId}`
