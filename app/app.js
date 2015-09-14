var broadway = require('broadway');
var app = new broadway.App();
app._ = require('lodash-node');


app.conf = require('config').get('app');
app._ = require('lodash-node');

app.use(require('./database/database.js'));
app.use(require('./server/server.js'));

app.init(function (err) {
  if (err) console.log(err);
});

app.findKey = function(obj, value) {
  var key;

  app._.each(obj, function (v, k) {
    if (v === value) {
      key = k;
    }
  });

  return key;
};

//kolm on väiksem kui viis
// 3 < 5
//kui selle kuu esimene esmaspäev on möödas(on väiksem) kui antud hetk, võta selle kuu oma. Kui ei võta eelmise oma.

// todo Write it more generic
app.getPeriod = function() {
  var start;
  var now = new Date();

  if (app.firstMonday(now.getMonth(), now.getFullYear()) < now) {
    start = app.firstMonday(now.getMonth(), now.getFullYear());
  } else {
    start = app.firstMonday(now.getMonth() - 1  , now.getFullYear());
  }

  return start;
};

app.firstMonday = function (month, year) {
  var d = new Date(year, month, 1, 0, 0, 0, 0);

  var day = 0;

  if (d.getDay() == 0) {
    day = 2
    d = d.setDate(day);
    d = new Date(d)
  }

  else if (d.getDay() != 1) {
    day = 9 - d.getDay();
    d = d.setDate(day);
    d = new Date(d)
  }

  return d
}
