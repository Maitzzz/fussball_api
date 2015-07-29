exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.game = app.db.define('game', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
};