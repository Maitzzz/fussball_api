var broadway = require('broadway');
var app = new broadway.App();
var _ = require('lodash-node');


app._ = require('lodash-node');
app.winston = require('winston');
//app.winston.level = 'debug';

app.conf = require('config').get('app');
app._ = require('lodash-node');
app.Promise = require("bluebird");


var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/uploads/')
  },
  filename: function (req, file, cb) {
    var getFileExt = function(fileName){
      var fileExt = fileName.split(".");
      if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
        return "";
      }
      return fileExt.pop();
    }
    cb(null, Date.now() + '.' + getFileExt(file.originalname))
  }
});

app.upload = multer({ storage: storage })

app.use(require('./database/database.js'));
app.use(require('./server/server.js'));
app.use(require('./server/wss.js'));

app.init(function (err) {
  if (err) console.log(err);
});

app.findKey = function (obj, value) {
  var key;

  app._.each(obj, function (v, k) {
    if (v === value) {
      key = k;
    }
  });

  return key;
};

//kui selle kuu esimene esmaspäev on möödas(on väiksem) kui antud hetk, võta selle kuu oma. Kui ei võta eelmise oma.
// todo Write it more generic
app.getPeriod = function () {
  var start;
  var now = new Date();

  if (app.firstMonday(now.getMonth(), now.getFullYear()) < now) {
    start = app.firstMonday(now.getMonth(), now.getFullYear());
  } else {
    start = app.firstMonday(now.getMonth() - 1, now.getFullYear());
  }

  return start;
};

app.firstMonday = function (month, year) {
  var d = new Date(year, month, 1, 0, 0, 0, 0);

  var day = 0;

  if (d.getDay() == 0) {
    day = 2;
    d = d.setDate(day);
    d = new Date(d)
  }

  else if (d.getDay() != 1) {
    day = 9 - d.getDay();
    d = d.setDate(day);
    d = new Date(d)
  }

  return d
};

app.compressArray = function (original) {

  var compressed = [];
  // make a copy of the input array
  var copy = original.slice(0);

  // first loop goes over every element
  for (var i = 0; i < original.length; i++) {

    var myCount = 0;
    // loop over every element in the copy and see if it's the same
    for (var w = 0; w < copy.length; w++) {
      if (original[i] == copy[w]) {
        // increase amount of times duplicate is found
        myCount++;
        // sets item to undefined
        delete copy[w];
      }
    }

    if (myCount > 0) {
      var a = new Object();
      a.player = original[i];
      a.count = myCount;
      compressed.push(a);
    }
  }

  return compressed;
};

app.isEmptyObject = function (obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
};

// todo find a way to create a module
app.pushMessages = function (driver, data) {
  // data consist which driver it sends, payload, data etc.
  if (driver, data) {
    switch (driver) {
      case 'websocket':
        app.wss.broadcast(data);
        break;

      default :
        return false;
    }
  } else {
    return false;
  }
};

app.DataGrouper = (function() {
  var has = function(obj, target) {
    return _.any(obj, function(value) {
      return _.isEqual(value, target);
    });
  };

  var keys = function(data, names) {
    return _.reduce(data, function(memo, item) {
      var key = _.pick(item, names);
      if (!has(memo, key)) {
        memo.push(key);
      }
      return memo;
    }, []);
  };

  var group = function(data, names) {
    var stems = keys(data, names);
    return _.map(stems, function(stem) {
      return {
        key: stem,
        vals:_.map(_.where(data, stem), function(item) {
          return _.omit(item, names);
        })
      };
    });
  };

  group.register = function(name, converter) {
    return group[name] = function(data, names) {
      return _.map(group(data, names), converter);
    };
  };

  return group;
}());

app.DataGrouper.register("sum", function(item) {
  return _.extend({}, item.key, {Value: _.reduce(item.vals, function(memo, node) {
    return memo + Number(node.Value);
  }, 0)});
});

app.getPlayersScoresFromGames = function (games, callback) {
  var ret = [];

  if (games) {
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

      winnings = app.compressArray(winnings);
      loses = app.compressArray(loses);

      app.eachAsync(users, function (user, index, done) {

        var wins = _.find(winnings, _.matchesProperty('player', user));
        var defeats = _.find(loses, _.matchesProperty('player', user));

        var userData = {
          winnings: wins.count,
          loses: defeats.count,
          score: Math.round(wins.count * 100 / (wins.count + defeats.count) * wins.count)
        };

        app.user.findOne({
          where: {
            active: true
          },
          attributes : ['email', 'name', 'user_id'],
          include: [{
            model: app.file,
            attributes: ['path', 'file_name']
          }]
        });

        app.user.findOne({
          where: {
            user_id: user
          },
          attributes : ['email', 'name', 'user_id'],
          include: [{
            model: app.file,
            attributes: ['path', 'file_name']
          }]
        }).then(function (player) {
          userData.player = player;

          ret.push(userData);
          done();
        });
      },function (error) {
        callback(app._.sortByOrder(ret, ['score'], ['desc']));
      });
    });
  }
};