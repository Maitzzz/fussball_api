exports.attach = function (options) {
  var app = this;
  var players = [];
  var time = 0;
  var timer_on = false;

  app.server.get('/start-draw', function (req, res, next) {
    app.game.getCurrentGame(function(err,ret) {
      if (!ret && !timer_on) {
        time = app.conf.game_draw_seconds;
        var i = setInterval(function () {
          time--;
          if (time <= 0) {
            game_timer_ended();
            timer_on = false;
            time = 0;
            clearInterval(i);
          }
        }, 1000);
      } else {
        //todo error message
      }
    })
  });

  app.server.get('/timer', function(req, res) {
    if(timer_on) {
      res.json(time);
    } else {
      res.status(400).json({message: 'Timer has not started!'});
    }
  });

  app.server.post('/add-player', function(req, res) {
    var player = req.body.player;
    if (player != undefined) {
      if(app._.indexOf(players, req.player.id)) {
        // todo create user adding validate
        players.push(req.player.id);
      } else {
        res.json({message: 'Player ' + req.player.id + ' id already in game'});
      }
    } else {
      res.status(400).json({message: 'Player is not set!'});
    }
  });

  function game_timer_ended() {
    if (players.length >= app.conf.players_in_game) {

    } else {
      return
    }
  }
};

// todo reasearch for logging.