// todo reasearch for logging.

exports.attach = function (options) {
  var app = this;
  var players = [];
  var time = 0;
  app.timer_on = false;
  //todo create class for methods keep only  enpoints in this file.

  app.server.get('/start-draw', function (req, res, next) {
    app.game.getCurrentGame(function (err, ret) {

      if (!ret && !app.timer_on) {
        time = app.conf.game_draw_seconds;

        var i = setInterval(function () {
          app.timer_on = true;
          time--;

          console.log(time);

          if (time <= 0) {
            app.game_timer_ended(function (err, ret) {
              console.log(err);
              console.log(ret);

              if (err) {
                app.winston.log('info', 'Error occurred in timer_ended function');
              }
              else {
                var message = {
                  driver: 'websocket',
                  type: 'system',
                  payload: {
                    message: 'game_drawn'
                  }
                };

                app.pushMessages(message);
              }
            });

            app.timer_on = false;
            time = 0;
            clearInterval(i);
          }
        }, 1000);

        res.json({message: 'Draw started'});
      } else {
        res.status(400).json({message: 'Game or Draw is on!'});
      }
    })
  });

  app.server.get('/timer', function (req, res) {
    if (app.timer_on && time) {
      res.json(time);
    } else {
      res.status(400).json({message: 'Timer has not started!'});
    }
  });

  app.server.post('/add-player', function (req, res) {
    var player = req.body;
    console.log(player)

    if (app.timer_on) {

      if (player != undefined) {

        app.user.validateUser(player, function (err, ret) {
          if (ret) {
            var player_index = app._.indexOf(players, player);

            if (player_index == -1) {

              // todo create user adding validate

              players.push(player);

              app.winston.log('Player ' + player + ' added in draw');

              res.json({type: 'add', message: 'Player ' + player + ' added to game'});
            }
            else {
              delete player[player_index];
              res.json({type: 'remove', message: 'Player ' + player + ' removed'});
            }
          }
        });
      }
    }
    else {
      res.status(400).json({message: 'Game has not started'});
    }
  });

  app.server.get('/get-players', function (req, res) {
    res.json(players);
  });


  app.game_timer_ended = function (callback) {
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
      callback(false, 'Not enough players!');
    }
  };
};
