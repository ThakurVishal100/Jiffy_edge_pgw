import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PricePoint = sequelize.define('PricePoint', {
    ppid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    validity_period: {
      type: DataTypes.INTEGER 
    },
    // Foreign keys for charging interface and payment plan
    chintf_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pplan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    has_fallback: {
      type: DataTypes.BOOLEAN, // Stores as 0/1 (false/true)
      defaultValue: false
    },
    is_fallback: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    charging_params: {
      type: DataTypes.TEXT 
    }
  }, {
    tableName: 'tbl_price_points',
    timestamps: false
  });

  return PricePoint;
};