import { DataTypes } from 'sequelize';


export default (sequelize) => {
  const ClientInfo = sequelize.define('ClientInfo', {
    client_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'test'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'tbl_client_info',
    timestamps: false
  });

  return ClientInfo;
};