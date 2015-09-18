exports.attach = function (options) {
  var app = this;
  var _ = require('lodash-node');

  app.server.get('/games', function (req, res, next) {
    app.game.findAll().then(function (games) {
      res.json(games);
    })
  });

  app.server.get('/game', function (req, res, next) {
    app.game.getCurrentGameData(function (err, game) {
      res.json(game);
    })
  });

  app.server.post('/newgame', function (req, res) {
    //todo parse user and check if valid, array_unique
    var players = req.body.players;
    app.game.getCurrentGame(function (err, current_game) {
      if (!current_game) {
        app.game.drawGame(players, function (err, prioritized) {
          if (!err) {
            app.game.createGame(prioritized, function (err, ret) {
              res.json({
                game: ret
              });
            });
          } else {
            res.status(409).json(prioritized);
          }
        });
      } else {
        res.status(409).json({error: 'Game is already in progress!'});
      }
    });
  });

  app.server.get('/game/:id', function (req, res) {
    app.game.getGameDataById(req.params.id, function (err, ret) {
      res.json(ret)
    });
  });

  app.server.get('/test', function (req, res) {
    app.game.getCurrentGame(function (err, ret) {
      res.json(ret);
    });
  });

  app.server.post('/addgoal', function (req, res) {
    app.goal.goalScored(req.body.team, req.body.owner, function (err, ret) {
      if (err) {
        res.json({error: "error"});
      } else {
        res.json({no_error: "no_error"});
      }
    })
  });

  app.server.get('/team/:id', function (req, res) {
    app.team.findById(req.params.id).then(function (team) {
      res.json(team)
    })
  });
};