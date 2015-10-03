exports.attach = function (options) {

  var app = this;
  var Sequelize = require('sequelize');
  app.conf = require('config').get('app');
  var db = new Sequelize(app.conf.db.database, app.conf.db.user, app.conf.db.password);
  app.draw = {};
  var players = [];
  var time = 0;

  app.timer_on = false;

  app.draw.drawGame = function (callback) {
    app.game.getCurrentGame(function (err, ret) {
      app.winston.log(ret);
      if (!ret && !app.timer_on) {
        time = app.conf.game_draw_seconds;

        var i = setInterval(function () {
          app.timer_on = true;
          time--;

          app.pushMessages('websocket', {time_left: time});

          if (time <= 0) {
            app.draw.game_timer_ended(function (err, ret) {
              if (err) {
                app.winston.log('info', 'Error occurred in timer_ended function');
                app.pushMessages('websocket', {type: 'error', error_type: 'not_enough_players', message: 'Not enough players!'});
              }
              else {
                var message = {
                  type: 'system',
                  payload: {
                    message: 'game_drawn'
                  }
                };

                app.pushMessages('websocket', message);
              }
            });

            app.timer_on = false;
            time = 0;
            clearInterval(i);
          }
        }, 1000);

        callback(false, {message: 'Draw started'});
      } else {
        callback(400, {message: 'Game or Draw is on!'});
      }
    })
  };

  app.draw.getTime = function (callback) {
    if (app.timer_on && time) {
      callback(false, time);
    } else {
      callback(400, {message: 'Timer has not started!'})
    }
  };

  app.draw.getPlayers = function(callback) {
    if (time) {
      callback(false, players);
    } else {
      callback(400, {message: 'Timer has not started!'});
    }
  };

  app.draw.game_timer_ended = function (callback) {
    if (players.length >= app.conf.players_in_game) {
      app.winston.log('Players in draw', players);

      app.game.drawGame(players, function (err, ret) {
        // empty participants array
        players = [];

        if (err) {
          app.winston.log('Game has been drawn', ret);
          callback(true, ret);
        } else {
          callback(false, ret);
        }
      });
    } else {
      callback(true, { message :'Not enough players!'});
    }
  };

  app.draw.addPlayer = function(player, callback) {
    if (app.timer_on) {

      if (player != undefined) {

        app.user.validateUser(player, function (err, ret) {
          if (ret) {
            var player_index = app._.indexOf(players, player);

            if (player_index == -1) {

              // todo create user adding validate

              players.push(player);

              app.winston.log('Player ' + player + ' added in draw');

              callback(false, {type: 'add', message: 'Player ' + player + ' added to game'});
            }
            else {
              delete player[player_index];
              callback(false, {type: 'remove', message: 'Player ' + player + ' removed'});
            }
          }
        });
      }
    }
    else {
      callback(400, {message: 'Game has not started'});
    }
  }
};