import { DataTypes } from 'sequelize';

export default function ProfileModel(sequelize) {
  return sequelize.define('Profile', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correo: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'gestor', 'trabajador'),
      allowNull: false,
      defaultValue: 'trabajador',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'profiles',
    timestamps: false,
  });
}
