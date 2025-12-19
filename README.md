# Backend de Comentarios

API REST para gestionar comentarios centralizados en Firestore.

## Requisitos
- Node.js
- Firebase con Firestore habilitado
- Archivo `firebase-credentials.json` en la raíz

## Instalación
```bash
npm install
```

## Ejecución
```bash
# Desarrollo (reinicia al guardar cambios)
npm run dev

# Producción
npm start
```

## Endpoints

### Crear Comentario
**POST** `/api/comments/:appId`

Body:
```json
{
  "author": "Nombre",
  "content": "Texto del comentario",
  "metadata": { "page": "home" }
}
```

### Listar Comentarios
**GET** `/api/comments/:appId`
- `?limit=20`: Limitar resultados.

## Estructura de Datos
Se utiliza subcolecciones en Firestore para evitar límites de tamaño:
`apps/{appId}/comments/{commentId}`
