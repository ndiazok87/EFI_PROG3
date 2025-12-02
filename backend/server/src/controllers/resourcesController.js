import { Resource, Plot } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const listResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: Plot, as: 'plots', attributes: ['id', 'nombre'] }],
    });
    res.json(resources);
  } catch (err) {
    console.error('listResources error:', err);
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
};

export const createResource = async (req, res) => {
  try {
    const payload = req.body;
    console.log('createResource called by userId=', req.userId, 'payload=', payload);
    if (payload.cantidad !== undefined && payload.cantidad < 0) {
      return res.status(400).json({ message: 'La cantidad no puede ser negativa' });
    }

    // Normalize parcela: empty string -> null to allow proper JOIN
    const normalizedParcela = payload.id_parcela ? payload.id_parcela : null;
    const id = payload.id || uuidv4();
    const now = new Date();
    const created = await Resource.create({ ...payload, id_parcela: normalizedParcela, id, created_at: now, updated_at: now });
    // Return with parcela info for immediate UI updates
    const createdWithPlot = await Resource.findByPk(created.id, {
      include: [{ model: Plot, as: 'plots', attributes: ['id', 'nombre'] }],
    });
    res.status(201).json(createdWithPlot);
  } catch (err) {
    console.error('createResource error:', err);
    res.status(500).json({ message: 'Error al crear recurso' });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (payload.cantidad !== undefined && payload.cantidad < 0) {
      return res.status(400).json({ message: 'La cantidad no puede ser negativa' });
    }

    const normalizedParcela = payload.id_parcela === undefined ? undefined : (payload.id_parcela ? payload.id_parcela : null);
    const updateBody = {
      ...payload,
      ...(normalizedParcela !== undefined ? { id_parcela: normalizedParcela } : {}),
      updated_at: new Date(),
    };

    const [updatedCount] = await Resource.update(updateBody, { where: { id } });
    if (!updatedCount) return res.status(404).json({ message: 'Recurso no encontrado' });
    const updated = await Resource.findByPk(id, {
      include: [{ model: Plot, as: 'plots', attributes: ['id', 'nombre'] }],
    });
    res.json(updated);
  } catch (err) {
    console.error('updateResource error:', err);
    res.status(500).json({ message: 'Error al actualizar recurso' });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Resource.destroy({ where: { id } });
    if (!deletedCount) return res.status(404).json({ message: 'Recurso no encontrado' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteResource error:', err);
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
};
