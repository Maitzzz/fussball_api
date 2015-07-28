exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.test = app.db.define('test', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    testname: Sequelize.STRING
  });

}