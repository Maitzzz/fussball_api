exports.attach = function (options) {
  var app = this;

  app.server.get('/games', app.cors(), function (req, res, next) {
    app.game.findAll().then(function (games) {
      res.json(games);
    })
  });

  app.server.get('/creategame', app.cors(), function (req, res) {
    app.game.createGame({}, function (err, ret) {
      res.json({
        game: ret
      })
    })
  });

  app.server.get('/game/:id', app.cors(), function (req, res) {
    app.game.getGameDataById(req.params.id, function(err, ret) {
      res.json(ret)
    });
  });

  app.server.get('/test', app.cors(), function (req, res) {
    app.game.getCurrentGameData(function(err, game) {
      res.json(game);
    })
  });

  app.server.get('/addmatch', app.cors(), function (req, res) {
    app.match.create({
      game: 8
    })
  });

  app.server.get('/addgoal', app.cors(), function (req, res) {
    app.goal.create({
      match: 2,
      owner: 1,
      team: 13
    });
  });
};