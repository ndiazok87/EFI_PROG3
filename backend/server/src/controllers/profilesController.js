import { Profile } from '../models/index.js';

export const listProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({ order: [['created_at', 'DESC']] });
    res.json(profiles);
  } catch (err) {
    console.error('listProfiles error:', err);
    res.status(500).json({ message: 'Error al obtener perfiles' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findByPk(id);
    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(profile);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // Authorization: allow if the requester is the profile owner or an admin
    const requesterId = req.userId;
    if (!requesterId) return res.status(401).json({ message: 'No autorizado' });
    const requesterProfile = await Profile.findByPk(requesterId);
    if (!requesterProfile) return res.status(403).json({ message: 'Perfil del solicitante no encontrado' });

    const isOwner = requesterId === id;
    const isAdmin = requesterProfile.rol === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'No tiene permiso para actualizar este perfil' });
    }

    const [updated] = await Profile.update({ ...payload, updated_at: new Date() }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Perfil no encontrado' });
    const profile = await Profile.findByPk(id);
    res.json(profile);
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};
