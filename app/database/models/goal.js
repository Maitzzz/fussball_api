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
    team: {
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      goalScored: function (team, owner, callback) {
        if (team && owner) {
          //todo error handling
          app.match.getCurrentMatch(function (err, match) {
            if (match) {
              app.goal.create({
                owner: owner,
                match: match,
                team: team
              }).then(function (data) {
                app.goal.count({
                  where: {
                    match: match,
                    team: team
                  }
                }).then(function (count) {
                  if (count == 10) {
                    app.match.setWinningTeam(match, team, function (err, ret) {
                      app.match.newMatch(function (err, ret) {
                        if (ret == 'match_created') {
                          app.draw.pushGameData();
                          app.pushMessages('websocket', 'goal_scored_with_new_match');
                        }
                      });
                    });
                  } else {
                    app.draw.pushGameData();
                    app.pushMessages('websocket', 'goal_scored');
                  }
                }).then(function (goal) {
                  callback(false, goal);
                });
              });
            } else {
              callback(false, false);
            }
          });
        } else {
          callback(400, 'Goal owner or team has not been set')
        }
      }
    }
  });
};

//todo create method to find player team