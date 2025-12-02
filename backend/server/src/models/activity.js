import { DataTypes } from 'sequelize';

export default function ActivityModel(sequelize) {
  return sequelize.define('Activity', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    nombre: { type: DataTypes.TEXT, allowNull: false },
    tipo: { type: DataTypes.ENUM('siembra','cosecha','fertilizacion','riego','fumigacion'), allowNull: false },
    id_parcela: { type: DataTypes.UUID, allowNull: false },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
    estado: { type: DataTypes.ENUM('pendiente','en progreso','completada'), defaultValue: 'pendiente' },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'activities', timestamps: false });
}
