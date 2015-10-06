exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.team = app.db.define('team', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    player_one: {
      type: Sequelize.INTEGER
    },

    player_two: {
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      getGameDataWithTeams: function(id, callback) {
        if (id) {
          app.game.findById(id).then(function(game) {
            game = game.dataValues;
            app.team.getTeamUsersData(game.team1, function(err, team1) {
              if(!err) {
                var team1Data = {};

                team1Data.id = game.team1;
                team1Data.data = team1;

                game.team1 = team1Data;

                app.team.getTeamUsersData(game.team2, function(err, team2) {
                  var team2Data = {};

                  team2Data.id = game.team2;
                  team2Data.data = team2;

                  game.team2 = team2Data;

                  callback(false, game);
                });
              }
            })
          })
        }
      },
      getTeamUsersData: function(teamId, callback) {
        var user = {};
        app.team.findById(teamId).then(function(team) {
          app.user.findById(team.player_one).then(function(player_one) {
            user.player_one = player_one;
            app.user.findById(team.player_two).then(function(player_two) {
              user.player_two = player_two;
              callback(false, user);
            })
          })
        });
      }
    }
  });
};