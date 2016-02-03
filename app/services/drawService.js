exports.attach = function (options) {

  var app = this;
  app.conf = require('config').get('app');

  app.draw = {};
  var players = [];
  var time = 0;

  app.timer_on = false;

  app.draw.drawGame = function (callback) {
    app.game.getCurrentGame(function (err, ret) {

      if (!ret && !app.timer_on) {
        time = app.conf.game_draw_seconds;
        app.pushMessages('websocket', {type: 'message', message: 'Timer started!'});
        app.pushMessages('websocket', {type: 'status', status: 'timer'});

        app.timer_on = true;
        var i = setInterval(function () {
          time--;

          app.pushMessages('websocket', {type: 'timer_data' ,time_left: time, players_count: players.length});

          if (time <= 0) {
            app.draw.game_timer_ended(function (err, ret) {
              if (err) {
                app.winston.log('info', 'Error occurred in timer_ended function');
                app.pushMessages('websocket', {
                  type: 'error',
                  error_type: 'not_enough_players',
                  message: 'Not enough players!'
                });

                app.pushMessages('websocket', {type: 'status', status: 'players'});
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

  app.draw.getPlayers = function (callback) {
    if (time) {
      callback(false, players);
    } else {
      callback(400, {message: 'Timer has not started!'});
    }
  };

  app.draw.game_timer_ended = function (callback) {
    console.log(players);
    if (players.length >= app.conf.players_in_game) {
      app.winston.log('Players in draw', players);

      app.game.drawGame(players, function (err, ret) {
        players = [];

        if (err) {
          app.winston.log('Game has been drawn', ret);

          callback(true, ret);
        } else {
          app.draw.pushGameData();
          app.pushMessages('websocket', {type: 'status', status: 'game'});

          callback(false, ret);
        }
      });
    } else {
      callback(true, {message: 'Not enough players!'});
    }
  };

  app.draw.addPlayer = function (player, callback) {

    if (app.timer_on) {
      if (player != undefined) {

        app.user.validateUser(player, function (err, ret) {
          console.log(ret)
          if (ret) {
            var player_index = app._.indexOf(players, player);

            if (player_index == -1) {

              players.push(player);

              app.winston.log('Player ' + player + ' added in draw');

              callback(false, {type: 'add', message: 'Player ' + player + ' added to game'});
            }
            else {
              var player_index = app._.indexOf(players, player);
              delete players[player_index];

              players = cleanArray(players);
              callback(false, {type: 'remove', message: 'Player ' + player + ' removed'});
            }
          } else {
            callback(400, {message: 'User was is nt eligible to play!'})
          }
        });
      }
    }
    else {
      callback(400, {message: 'Game has not started'});
    }
  };

  app.draw.getState = function (callback) {
    app.game.getCurrentGame(function (err, ret) {
      if (ret) {
        callback('game');
      } else {
        if (app.timer_on) {
          callback('timer');
        } else {
          callback('players');
        }
      }
    });
  };

  app.draw.pushGameData = function() {
    app.game.getCurrentGameData(function(err, ret) {
      var data = {
        type: 'game_data',
        data: ret
      };

      app.pushMessages('websocket', data);
    });
  };

  function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }

};