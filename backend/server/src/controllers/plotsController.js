import { Plot } from '../models/index.js';

export const listPlots = async (req, res) => {
  try {
    const plots = await Plot.findAll({ order: [['created_at', 'DESC']] });
    res.json(plots);
  } catch (err) {
    console.error('listPlots error:', err);
    res.status(500).json({ message: 'Error al obtener parcelas' });
  }
};

export const createPlot = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Plot.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error('createPlot error:', err);
    res.status(500).json({ message: 'Error al crear parcela' });
  }
};

export const updatePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const [updated] = await Plot.update({ ...payload, updated_at: new Date() }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Parcela no encontrada' });
    const plot = await Plot.findByPk(id);
    res.json(plot);
  } catch (err) {
    console.error('updatePlot error:', err);
    res.status(500).json({ message: 'Error al actualizar parcela' });
  }
};

export const deletePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Plot.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Parcela no encontrada' });
    res.status(204).send();
  } catch (err) {
    console.error('deletePlot error:', err);
    res.status(500).json({ message: 'Error al eliminar parcela' });
  }
};
