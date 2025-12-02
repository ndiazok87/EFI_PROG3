import { ActivityAssignment } from '../models/index.js';

export const listAssignments = async (req, res) => {
  try {
    const assignments = await ActivityAssignment.findAll({ order: [['asignado_en', 'DESC']] });
    res.json(assignments);
  } catch (err) {
    console.error('listAssignments error:', err);
    res.status(500).json({ message: 'Error al obtener asignaciones' });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const payload = req.body;
    const created = await ActivityAssignment.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error('createAssignment error:', err);
    res.status(500).json({ message: 'Error al crear asignación' });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ActivityAssignment.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Asignación no encontrada' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteAssignment error:', err);
    res.status(500).json({ message: 'Error al eliminar asignación' });
  }
};
