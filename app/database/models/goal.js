exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.goal = app.db.define('goal', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    owner: {
      type: Sequelize.INTEGER
    },
    match: {
      type: Sequelize.INTEGER
    }
  });
};