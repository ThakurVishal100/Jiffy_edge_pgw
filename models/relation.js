import sequelize from '../config/database.js';


import ClientInfo from './client_info_model.js';
import ServiceInfo from './service_info_model.js';
import ChargingInterface from './charging_interface_model.js';
import ChIntfApiInfo from './chintf_api_info_model.js';
import PaymentPlan from './payment_plan_model.js';
import PricePoint from './price_points_model.js';


const models = {
  ClientInfo: ClientInfo(sequelize),
  ServiceInfo: ServiceInfo(sequelize),
  ChargingInterface: ChargingInterface(sequelize),
  ChIntfApiInfo: ChIntfApiInfo(sequelize),
  PaymentPlan: PaymentPlan(sequelize),
  PricePoint: PricePoint(sequelize)
};


models.PaymentPlan.belongsTo(models.ServiceInfo, {
  foreignKey: 'service_id'
});

models.ServiceInfo.hasMany(models.PaymentPlan, {
  foreignKey: 'service_id'
});



models.PaymentPlan.belongsTo(models.ClientInfo, {
  foreignKey: 'client_id'
});

models.ClientInfo.hasMany(models.PaymentPlan, {
  foreignKey: 'client_id'
});



models.PricePoint.belongsTo(models.PaymentPlan, {
  foreignKey: 'pplan_id'
});

models.PaymentPlan.hasMany(models.PricePoint, {
  foreignKey: 'pplan_id'
});



models.PricePoint.belongsTo(models.ChargingInterface, {
  foreignKey: 'chintf_id'
});

models.ChargingInterface.hasMany(models.PricePoint, {
  foreignKey: 'chintf_id'
});



models.ChIntfApiInfo.belongsTo(models.ChargingInterface, {
  foreignKey: 'chintf_id'
});

models.ChargingInterface.hasMany(models.ChIntfApiInfo, {
  foreignKey: 'chintf_id'
});


export default models;