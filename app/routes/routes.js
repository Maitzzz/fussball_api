exports.attach = function (options) {
  var app = this;

  app.server.get('/games', function (req, res, next) {
    app.game.findAll().then(function (games) {
      res.json(games);
    })
  });

  app.server.get('/creategame', function (req, res) {
    app.game.createGame({}, function (err, ret) {
      res.json({
        game: ret
      })
    })
  });

  app.server.get('/game/:id', function (req, res) {
    app.game.getGameDataById(req.params.id, function(err, ret) {
      res.json(ret)
    });
  });

  app.server.get('/test', function (req, res) {
    app.match.newMatch(function(err, game) {
      res.json(game);
    })
  });

  app.server.get('/test2', function (req, res) {
    app.match.create({
      winning_team: 332232,
      game:10
    })
  });

  app.server.get('/addmatch', function (req, res) {
    app.match.create({
      game: 8
    })
  });

  app.server.post('/addgoal', function (req, res) {
    app.goal.goalScored(req.body.team, req.body.owner, function(err, ret) {
      if(err) {
        res.json({error: "error"});
      } else {
        res.json({no_error: "no_error"});
      }
    })
  });

  app.server.get('/team/:id', function(req, res) {
    app.team.findById(req.params.id).then(function(team) {
      res.json(team)
    })
  });
};