
# Agro-Precision EFI Prog3

Estructura organizada para desplegar frontend (Vercel) y backend (Railway):

```
AGRO-PRESICION_EFI_PROG3/
├── frontend/          # Vite + React
│   ├── src/
│   ├── public/
│   └── vite.config.ts
├── backend/           # Express + Sequelize
│   ├── server/
│   └── package.json
└── README.md
```

## Frontend (Vercel)
- `cd frontend`
- Instala dependencias: `npm install`
- Variables: crear/editar `frontend/.env` (ej. `VITE_API_URL="http://localhost:8000"`)
- Ejecutar: `npm run dev` (puerto 8080), `npm run build` y `npm run preview`

## Backend (Railway)
- `cd backend`
- Instala dependencias: `npm install`
- Copia variables: `copy .env.example .env` y ajusta `PORT`, `JWT_SECRET`, `FRONTEND_URL`; para producción define `MYSQL_*`.
- Desarrollo (SQLite ya en `backend/dev.sqlite`): `npm run dev`
- Migraciones/seed (MySQL): `npm run migrate` y `npm run seed`
- Producción: `npm start`

## Notas
- El backend carga env desde `backend/.env` y usa SQLite en desarrollo; en producción usa MySQL con las variables `MYSQL_*`.
- Para comandos de Sequelize CLI se usa la ruta configurada vía `.sequelizerc.cjs` en `backend/`.
- Ajusta `VITE_API_URL` según el dominio Railway para que el frontend apunte al backend desplegado.
