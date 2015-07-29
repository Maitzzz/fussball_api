exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.team = app.db.define('team', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });

  app.team.hasMany(app.user, { trough: 'team_users' });
};