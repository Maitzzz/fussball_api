exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');



  app.file = app.db.define('match', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    file_name: {
      type: Sequelize.STRING
    },
    path: {
      type: Sequelize.STRING
    },
    content_type: {
      type: Sequelize.STRING
    }
  });

};