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
    });
  });

  app.server.get('/game', function (req, res, next) {
    app.game.getCurrentGameData(function (err, game) {
      res.json(game);
    });
  });


  app.server.get('/games_in_period', function (req, res, next) {
    //todo find a way how to create better query to ger teams.
    var end = new Date();
    var start = app.getPeriod();
    var ret = [];

    app.game.getGames(start, end, function (err, games) {

      if (!err) {
        var data = [];

        app.eachAsync(games.rows, function (item, index, done) {
          app.team.findById(item.team1).then(function (team1) {
            app.team.findById(item.team2).then(function (team2) {

              var obj = {
                winning_team: item.winning_team,
                teams: [team1, team2]
              };

              data.push(obj);
              done();
            });
          });
        }, function (error) {
          var winnings = [];
          var loses = [];
          var users = [];

          for (var i = 0; i < data.length; i++) {
            var winning_team = data[i].winning_team;
            var teams = data[i].teams;

            for (var j = 0; j < teams.length; j++) {
              if (teams[j].id == winning_team) {
                winnings.push(teams[j].player_one);
                winnings.push(teams[j].player_two);
              }

              loses.push(teams[j].player_one);
              loses.push(teams[j].player_two);

              users.push(teams[j].player_one);
              users.push(teams[j].player_two);

              users = _.uniq(users);
            }

          }

          winnings = app.compressArray(winnings)
          loses =  app.compressArray(loses)

          for (var i = 0; i < users.length; i++) {

            var user = {
              user: users[i],
              winnings: _.find(winnings, _.matchesProperty('player', 1)).count,
              loses: _.find(loses, _.matchesProperty('player', 1)).count
            };

            ret.push(user)
          }


          res.json(ret);
        });
      }
    });
  });

  app.server.post('/newgame', function (req, res) {
    // todo user who started draw should be included in draw automatically
    var players = app._.uniq(req.body.players);

    if (players != undefined) {
      app.game.drawGame(players, function (err, gameData) {
        if (err) {
          res.status(400).json({message: err})
        } else {
          app.draw.pushGameData();
          app.pushMessages('websocket', {type: 'status', status: 'game'});
        }
      });
    } else {
      console.log('thiserror')
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

  app.server.post('/addgoal', function (req, res) {
    app.goal.goalScored(req.body.team, req.body.owner, function (err, ret) {
      if (err) {
        res.status(err).json(ret);
      } else {
        res.json({
          no_error: "no_error"
        });
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
    var name = req.body.name;

    if (password && email) {
      app.user.create({
        "email": email,
        "password": passwordHash.generate(password),
        "name": name
      }).then(function(user) {
        res.json({success: true, message: 'user ' + email + ' created'});
      }).catch(function(err) {
        res.status(403).json({message: err.errors[0].message});
      });
    } else {
      res.status(403).json({message: 'No password or email!'})
    }
  });

  app.server.post('/upload', app.authUser, app.upload.single('file'), function(req, res) {
    var file = req.file;
    var user = req.decoded;

    app.file.editUserProfilePicture(file, user, function(err, ret) {
      if(err) {
        res.status(err).json(ret);
      } else {
        res.json(ret);
      }
    });
  });

  app.server.get('/user', app.authUser, function(req, res) {
    var user = req.decoded;
    app.user.findById(user.user_id).then(function (data) {
      res.json(data);
    })
  });

  app.server.get('/update_user', app.authUser, function(req, res) {
    var email = req.body.email;
    var name = req.body.name;

      app.user.create({
        "email": email,
        "name": name
      }).then(function(user) {
        res.json({success: true, message: 'user ' + name + ' created'});
      }).catch(function(err) {
        console.log(err);
        res.status(403).json({message: err.errors[0].message});
      });
  });

  app.server.get('/players', function(req, res) {
    app.user.findAll({
      where: {
        active: true
      },
      attributes : ['email', 'name', 'user_id'],
      include: [{
        model: app.file,
        attributes: ['path', 'file_name']
      }]
    }).then(function (players) {
      for (var i = 0, len = players.length; i < len; i++) {
        if (players[i].file) {
          players[i].file.path = req.protocol + '://' + req.get('host') + '/' + app.conf.uploads + '/' + players[i].file.file_name;
        }
      }

      res.json(players);
    });
  });
};