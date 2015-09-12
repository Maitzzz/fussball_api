exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.match = app.db.define('match', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    side: {
      type: Sequelize.STRING
    },
    winning_team: {
      type: Sequelize.INTEGER
    }
  });
};