import { DataTypes } from 'sequelize';

export default function PasswordResetModel(sequelize) {
  return sequelize.define('PasswordReset', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.STRING(36), allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'password_resets', timestamps: false });
}
