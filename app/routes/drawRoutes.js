// todo reasearch for logging.

exports.attach = function (options) {
  var app = this;
  var players = [];
  var time = 0;
  app.timer_on = false;

  app.server.get('/start-draw', function (req, res, next) {
    app.draw.drawGame(function (err, ret) {
      if (err) {
        res.status(err).json(ret);
      } else {
        res.json(ret);
      }
    });
  });

  app.server.get('/timer', function (req, res) {
    app.draw.getTime(function (err, ret) {
      if (err) {
        res.status(err).json(ret);
      } else {
        res.json(ret);
      }
    });
  });

  app.server.post('/add-player', app.authUser, function (req, res) {
    var player = req.body.player;
    var user = req.body.user;

    if (user.user_id == player || user.type == app.conf.admin) {
      app.draw.addPlayer(player, function (err, ret) {
        if (err) {
          res.status(err).json(ret);
        } else {
          res.json(ret);
        }
      })
    } else {
      res.status(401).json({message: 'You cant add anybody else than you!'});
    }
  });

  app.server.get('/get-players', function (req, res) {
    app.draw.getPlayers(function (err, ret) {
      if (err) {
        res.status(err).json(ret);
      } else {
        res.json(ret);
      }
    })
  });
};
