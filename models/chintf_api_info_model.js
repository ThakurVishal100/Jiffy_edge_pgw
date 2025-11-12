import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ChIntfApiInfo = sequelize.define('ChIntfApiInfo', {
    api_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    api_name: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    // Foreign key for charging interface
    chintf_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'tbl_chintf_api_info',
    timestamps: false
  });

  return ChIntfApiInfo;
};