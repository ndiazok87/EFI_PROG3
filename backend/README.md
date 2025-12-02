# Backend - Agro Precision

Ubicación de la API: `backend/server/`. Ejecuta comandos desde `backend/`.

## Pasos rápidos
1) Instala dependencias:
```powershell
cd backend
npm install
```

2) Variables de entorno:
```powershell
copy .env.example .env
```
Configura `PORT`, `JWT_SECRET`, `FRONTEND_URL` y, para producción, `MYSQL_*`.

3) Desarrollo (SQLite):
```powershell
npm run dev
```
SQLite se guarda en `backend/dev.sqlite`.

4) Producción (MySQL) y migraciones:
```powershell
$env:NODE_ENV='production'
npm run migrate
npm run seed
npm start
```

Notas:
- Sequelize CLI usa `.sequelizerc.cjs` en `backend/` para ubicar `server/config`, `server/migrations`, `server/seeders` y `server/src/models`.
- El servidor expone `/api/*` y espera que el frontend configure `VITE_API_URL` hacia la URL pública del backend.
