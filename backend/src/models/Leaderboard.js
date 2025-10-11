import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Leaderboard = sequelize.define('Leaderboard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  participantName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  participantId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeInSeconds: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'qr_sessions',
      key: 'sessionId'
    }
  },
  adminEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scramble: {
    type: DataTypes.STRING,
    allowNull: true
  },
  validatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'leaderboard',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['timeInSeconds']
    },
    {
      fields: ['sessionId']
    },
    {
      fields: ['validatedAt']
    }
  ]
});

export default Leaderboard;