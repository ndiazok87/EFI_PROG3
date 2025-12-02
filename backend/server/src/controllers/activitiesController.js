import { Activity, Plot, ActivityAssignment, Worker, Profile } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

function buildActivityResponse(activityInstance) {
  const plain = activityInstance.get ? activityInstance.get({ plain: true }) : activityInstance;
  const assignment = plain.assignments && plain.assignments.length > 0 ? plain.assignments[0] : null;
  const workerProfile = assignment?.worker?.profiles;
  return {
    ...plain,
    id_trabajador: assignment?.id_trabajador || null,
    profiles: workerProfile
      ? { id: workerProfile.id, nombre: workerProfile.nombre, correo: workerProfile.correo }
      : undefined,
  };
}

export const listActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      order: [['fecha_inicio', 'DESC']],
      include: [
        { model: Plot, as: 'plots' },
        {
          model: ActivityAssignment,
          as: 'assignments',
          include: [
            {
              model: Worker,
              as: 'worker',
              include: [{ model: Profile, as: 'profiles', attributes: ['id', 'nombre', 'correo'] }],
            },
          ],
        },
      ],
    });
    res.json(activities.map(buildActivityResponse));
  } catch (err) {
    console.error('listActivities error:', err);
    res.status(500).json({ message: 'Error al obtener actividades' });
  }
};

export const createActivity = async (req, res) => {
  try {
    const payload = req.body;
    const { id_trabajador, ...activityData } = payload;
    const created = await Activity.create({ ...activityData, id: payload.id || uuidv4() });

    // manejar asignación de trabajador (opcional) vía tabla pivote
    if (id_trabajador) {
      await ActivityAssignment.create({
        id_actividad: created.id,
        id_trabajador,
      });
    }

    const activity = await Activity.findByPk(created.id, {
      include: [
        { model: Plot, as: 'plots' },
        {
          model: ActivityAssignment,
          as: 'assignments',
          include: [
            {
              model: Worker,
              as: 'worker',
              include: [{ model: Profile, as: 'profiles', attributes: ['id', 'nombre', 'correo'] }],
            },
          ],
        },
      ],
    });
    res.status(201).json(buildActivityResponse(activity));
  } catch (err) {
    console.error('createActivity error:', err);
    res.status(500).json({ message: 'Error al crear actividad' });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { id_trabajador, ...activityData } = payload;
    const [updated] = await Activity.update({ ...activityData, updated_at: new Date() }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Actividad no encontrada' });

    if (id_trabajador !== undefined) {
      // eliminar asignaciones previas y crear la nueva si corresponde
      await ActivityAssignment.destroy({ where: { id_actividad: id } });
      if (id_trabajador) {
        await ActivityAssignment.create({ id_actividad: id, id_trabajador });
      }
    }

    const activity = await Activity.findByPk(id, {
      include: [
        { model: Plot, as: 'plots' },
        {
          model: ActivityAssignment,
          as: 'assignments',
          include: [
            {
              model: Worker,
              as: 'worker',
              include: [{ model: Profile, as: 'profiles', attributes: ['id', 'nombre', 'correo'] }],
            },
          ],
        },
      ],
    });
    res.json(buildActivityResponse(activity));
  } catch (err) {
    console.error('updateActivity error:', err);
    res.status(500).json({ message: 'Error al actualizar actividad' });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Activity.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteActivity error:', err);
    res.status(500).json({ message: 'Error al eliminar actividad' });
  }
};
