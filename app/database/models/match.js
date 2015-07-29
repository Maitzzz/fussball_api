exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.match = app.db.define('users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    start: {
      type: Sequelize.TIME
    },
    end: {
      type: Sequelize.TIME
    },
    side: {
      type: Sequelize.STRING
    },
    winning_team: {
      type: Sequelize.INTEGER
    }
  });

  app.match.belongsTo(app.game);
};