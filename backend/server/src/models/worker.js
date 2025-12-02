import { DataTypes } from 'sequelize';

export default function WorkerModel(sequelize) {
  return sequelize.define('Worker', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    especialidad: { type: DataTypes.TEXT, allowNull: false },
    id_usuario: { type: DataTypes.UUID, allowNull: false, unique: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'workers', timestamps: false });
}
