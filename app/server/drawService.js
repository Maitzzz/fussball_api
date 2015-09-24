// todo reasearch for logging.

exports.attach = function (options) {
  var app = this;
  var players = [];
  var time = 0;
  var timer_on = false;

  app.server.get('/start-draw', function (req, res, next) {
    app.game.getCurrentGame(function (err, ret) {
      if (!ret && !timer_on) {
        time = app.conf.game_draw_seconds;
        var i = setInterval(function () {
          timer_on = true;
          time--;
          console.log(time);
          if (time <= 0) {
            app.game_timer_ended(function (err, ret) {
              if (err) {
                app.winston.log('info', 'Error occurred in timer_ended function');
              } else {
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

            timer_on = false;
            time = 0;
            clearInterval(i);
          }
        }, 1000);
      } else {
        res.status(400).json({message: 'Game or Draw is on!'});
      }
    })
  });

  app.server.get('/timer', function (req, res) {
    if (timer_on && time) {
      res.json(time);
    } else {
      res.status(400).json({message: 'Timer has not started!'});
    }
  });

  app.server.post('/add-player', function (req, res) {
    var player = req.body.player;
    if (timer_on) {
      if (player != undefined) {
        if (app._.indexOf(players, req.player.id)) {
          // todo create user adding validate
          players.push(req.player.id);
        } else {
          res.json({message: 'Player ' + req.player.id + ' id already in game'});
        }
      } else {
        res.status(400).json({message: 'Player is not set!'});
      }
    } else {
      res.status(400).json({message: 'Game has not started'});
    }
  });

  app.server.get('/get-players', function (req, res) {
    res.json(players);
  });


  app.game_timer_ended = function (callback) {
    if (players.length >= app.conf.players_in_game) {
      app.winston.log('Players Added to Draw', players);
      // empty participants array
      players = [];

      app.game.drawGame(players, function (err, ret) {
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
