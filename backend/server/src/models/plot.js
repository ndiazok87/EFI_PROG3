import { DataTypes } from 'sequelize';

export default function PlotModel(sequelize) {
  return sequelize.define('Plot', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombre: { type: DataTypes.TEXT, allowNull: false },
    superficie: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    tipo_cultivo: { type: DataTypes.ENUM('maiz','trigo','soja','girasol','otro'), allowNull: false },
    estado: { type: DataTypes.ENUM('sembrado','cosechado','en preparacion'), allowNull: false, defaultValue: 'en preparacion' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'plots', timestamps: false });
}
