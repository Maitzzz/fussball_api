exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.user = app.db.define('users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    type: {
      type: Sequelize.INTEGER
    },
    active: {
      type: Sequelize.BOOLEAN
    }
  });
};