exports.attach = function (options) {
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
    },
    side: {
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      goalScored: function (side, owner, callback) {
        //todo error handling
        app.match.getCurrentMatch(function (err, match) {
          app.goal.count({
            where: {
              match: match,
              side: side
            }
          }).then(function (count) {
            if (count == 10) {
              app.match.newMatch({

              });
            } else {
              app.goal.create( {
                owner: owner,
                match: match
              });
            }
          }).then(function(goal) {
            callback(false, goal);
          });
        });
      }
    }
  });
};
//todo create method to find player side