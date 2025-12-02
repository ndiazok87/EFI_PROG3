import { Worker, Profile } from '../models/index.js';

export const listWorkers = async (req, res) => {
  try {
    const workers = await Worker.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: Profile, as: 'profiles' }]
    });
    res.json(workers);
  } catch (err) {
    console.error('listWorkers error:', err);
    res.status(500).json({ message: 'Error al obtener trabajadores' });
  }
};

export const createWorker = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Worker.create(payload);
    // Volver a consultar con el Profile incluido para obtener nombre, correo y rol
    const worker = await Worker.findByPk(created.id, {
      include: [{ model: Profile, as: 'profiles' }]
    });
    res.status(201).json(worker);
  } catch (err) {
    console.error('createWorker error:', err);
    res.status(500).json({ message: 'Error al crear trabajador' });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const [updated] = await Worker.update({ ...payload, updated_at: new Date() }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Trabajador no encontrado' });
    const worker = await Worker.findByPk(id, {
      include: [{ model: Profile, as: 'profiles' }]
    });
    res.json(worker);
  } catch (err) {
    console.error('updateWorker error:', err);
    res.status(500).json({ message: 'Error al actualizar trabajador' });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Worker.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Trabajador no encontrado' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteWorker error:', err);
    res.status(500).json({ message: 'Error al eliminar trabajador' });
  }
};
