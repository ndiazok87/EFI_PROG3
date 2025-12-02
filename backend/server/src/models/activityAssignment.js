import { DataTypes } from 'sequelize';

export default function ActivityAssignmentModel(sequelize) {
  return sequelize.define('ActivityAssignment', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_actividad: { type: DataTypes.UUID, allowNull: false },
    id_trabajador: { type: DataTypes.UUID, allowNull: false },
    asignado_en: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'activity_assignments', timestamps: false });
}
