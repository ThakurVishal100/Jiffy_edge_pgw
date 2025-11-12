import sequelize from '../config/database.js'; 
import ClientInfo from './client_info_model.js';
import ServiceInfo from './service_info_model.js';


const models = {
  ClientInfo: ClientInfo(sequelize),
  ServiceInfo: ServiceInfo(sequelize),
};


export { sequelize };   
export default models;