exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.testlist = app.db.define('testlist', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });

};