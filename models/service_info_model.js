import { DataTypes } from 'sequelize';


export default (sequelize) => {
  const ServiceInfo = sequelize.define('ServiceInfo', {
    service_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'test'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'tbl_service_info',
    timestamps: false
  });

  return ServiceInfo;
};