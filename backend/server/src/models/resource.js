import { DataTypes } from 'sequelize';

export default function ResourceModel(sequelize) {
  return sequelize.define('Resource', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('maquinaria', 'fertilizantes', 'semillas', 'herramientas'),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    id_parcela: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'resources',
    timestamps: false,
  });
}
