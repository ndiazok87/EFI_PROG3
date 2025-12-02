import { Profile } from '../models/index.js';

/**
 * authorize(roles...)
 * middleware factory that ensures the authenticated user has one of the allowed roles.
 * If no roles passed, allows any authenticated user.
 */
export default function authorize(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ message: 'No autorizado' });

      const profile = await Profile.findByPk(userId);
      if (!profile) return res.status(403).json({ message: 'Perfil no encontrado' });

      const role = profile.rol;
      if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
        // attach profile for downstream use
        req.profile = profile;
        return next();
      }

      return res.status(403).json({ message: 'No tiene permisos para realizar esta acción' });
    } catch (err) {
      console.error('authorize error:', err);
      return res.status(500).json({ message: 'Error en autorización' });
    }
  };
}
