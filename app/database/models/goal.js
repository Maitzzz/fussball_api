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
                console.log('count ' + count)
                if (count == 10) {
                  app.match.setWinningTeam(match, team, function(err, ret) {
                    app.match.newMatch(function(ret) {
                      console.log('Win!')
                    });
                  });
                }
              }).then(function (goal) {
                callback(false, goal);
              });
            });
          } else (callback(false, false));
        });
      }
    }
  });
};

//todo create method to find player team