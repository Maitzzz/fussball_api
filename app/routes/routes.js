exports.attach = function (options) {
  var app = this;
  var _ = require('lodash-node');
  var passport = require('passport');
  var passwordHash = require('password-hash');
  app.server.set('superSecret', app.conf.secret);

  app.server.get('/games', function (req, res, next) {
    app.game.findAll({
      where: {
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
    // todo inf user is set add hin automatically to game.
    var players = app._.uniq(req.body.players);
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

  app.server.post('/auth', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (email && password) {
      app.user.findOne({
        where: {
          email: req.body.email
        }
      }).then(function (user) {
        if (user != null) {
          if (passwordHash.verify(password,user.password)) {
            var token = app.jwt.sign(user, app.server.get('superSecret'), {
              expiresInMinutes: 1440
            });

            res.json(token);
          } else {
            res.status(401).json({message: 'Wrong password!'})
          }
        } else {
          res.status(401).json({message: 'authentication failed, no user'});
        }
      });
    } else {
      res.state(403).json({message: 'No password or email!'})
    }

  });

  app.server.get('/test', function (req, res) {
    var end = new Date();
    var start = app.getPeriod();
    var players = [3, 1, 5, 8,8,9,9,9,6,6,3,4,2];

    app.pushMessages('websocket', { message: 'Message'});
    res.json('ds');

  });

  app.server.post('/addgoal', function (req, res) {
    app.goal.goalScored(req.body.team, req.body.owner, function (err, ret) {
      if (err) {
      } else {
        res.json({no_error: "no_error"});
      }
    })
  });

  app.server.get('/team/:id', function (req, res) {
    app.team.findById(req.params.id).then(function (team) {
      res.json(team);
    })
  });

  app.server.get('/remove/:id', function (req, res) {
    app.game.removeGame(req.params.id, function (err, ret) {
      res.json({message: 'Removed', rer: ret})
    });
  });

  app.server.post('/register', function(req, res) {
    var password = req.body.password;
    var email = req.body.email;

    if (password && email) {
      app.user.create({
        "email": email,
        "password": passwordHash.generate(password)
      }).then(function(user) {
        res.json({success: true, message: 'user ' + email + ' created'});
      });
    } else {
      res.status(403).json({message: 'No password or email!'})
    }
  });

  app.server.post('/profile', app.upload.single('avatar'), function(req, res) {

  });
};