exports.attach = function (options) {
  var app = this;
  var _ = require('lodash-node');
  var passport = require('passport');


  app.server.get('/games', function (req, res, next) {
    app.game.findAll({
      where:{
        active: true
      }
    }).then(function (games) {
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
    if (players != undefined) {
      app.game.drawGame(players, function (err, gameData) {
        if (err) {
          res.status(400).json({message: gameData})
        } else {
          res.json({game: gameData})
        }
      });
    } else {
      res.status(400).json({error: 'Players is not set!'});
    }
  });

  app.server.get('/game/:id', function (req, res) {
    app.game.getGameDataById(req.params.id, function (err, ret) {
      res.json(ret)
    });
  });

  app.server.get('/test', function (req, res) {
    var end = new Date();
    var start = app.getPeriod();
    var players = [3, 1, 5, 8];

  /*  app.game.drawGame(players, function(err,ret) {
      res.json(ret)
    });
      res.json(ret);
    })*/

    console.log();
    res.json(req.isAuthenticated());

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

  app.server.get('/auth/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/userinfo.email'}) );

  app.server.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), function(req, res) {
    res.redirect('/');
  });

  app.server.get('/team/:id', function (req, res) {
    app.team.findById(req.params.id).then(function (team) {
      res.json(team);
    })
  });
  
  app.server.get('/remove/:id', function(req, res) {
    app.game.removeGame(req.params.id, function(err, ret) {
     res.json({message: 'Removed', rer: ret})
    });
  });
};