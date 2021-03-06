import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Students from '../app/models/Students';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Checkins from '../app/models/Checkins';
import HelpOrders from '../app/models/HelpOrders';

import databaseConfig from '../config/database';

const models = [User, File, Students, Plan, Enrollment, Checkins, HelpOrders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
