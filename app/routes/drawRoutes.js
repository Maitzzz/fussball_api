// todo reasearch for logging.

exports.attach = function (options) {
  var app = this;

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
        console.log(err)
        res.status(403).json({message: err.errors[0].message});
      });
    } else {
      res.status(403).json({message: 'No password or email!'})
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
