import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentPlan = sequelize.define('PaymentPlan', {
    pplan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    plan_name: {
      type: DataTypes.STRING
    },
    payment_category: {
      type: DataTypes.ENUM('one time', 'Subscription', 'Addon-topup')
    },
    validity_start: {
      type: DataTypes.DATE
    },
    validity_end: {
      type: DataTypes.DATE
    },
    // Foreign keys for service and client are defined in index.js
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'test'),
      allowNull: false,
      defaultValue: 'active'
    },
    master_price: {
      type: DataTypes.DECIMAL(10, 2) // Good for currency (10 digits, 2 decimal places)
    },
    master_validity: {
      type: DataTypes.INTEGER 
    },
    plan_description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'tbl_payment_plan',
    timestamps: false
  });

  return PaymentPlan;
};