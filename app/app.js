var broadway = require('broadway');
var app = new broadway.App();

app._ = require('lodash-node');
app.winston = require('winston');

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

app.compressArray = function(original) {

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
f
  return compressed;
};

app.isEmptyObject  = function(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// todo find a way to create a module
app.pushMessages = function(data) {
 // data consist which driver it sends, payload, data etc.
  var driver = data.driver;
  switch (data.driver) {
    case 'websocket':

  }


};