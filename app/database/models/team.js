exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.team = app.db.define('team', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    player_one: {
      type: Sequelize.INTEGER
    },

    player_two: {
      type: Sequelize.INTEGER
    }
  });
};