import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ChargingInterface = sequelize.define('ChargingInterface', {
    chintf_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    chintf_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chintf_handler: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'test'),
      allowNull: false,
      defaultValue: 'active'
    },
    description: {
      type: DataTypes.TEXT
    },
    callback_url: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'tbl_charging_interface',
    timestamps: false
  });

  return ChargingInterface;
};