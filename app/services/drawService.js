var exports = module.exports = {};
var app = this;
var db = require('../database/database.js');
var players = [];
var time = 0;

app.timer_on = false;

exports.drawGame = function () {
  db.getCurrentGame(function (err, ret) {
      console.log(ret);
      console.log('Current game');
    if (!ret && !app.timer_on) {
      time = app.conf.game_draw_seconds;

      var i = setInterval(function () {
        app.timer_on = true;
        time--;

        app.pushMessages('websocket', { time_left: time });

        if (time <= 0) {
          app.game_timer_ended(function (err, ret) {
            console.log(err);
            console.log(ret);

            if (err) {
              app.winston.log('info', 'Error occurred in timer_ended function');
            }
            else {
              var message = {
                type: 'system',
                payload: {
                  message: 'game_drawn'
                }
              };

              app.pushMessages('websocket', message);
            }
          });

          app.timer_on = false;
          time = 0;
          clearInterval(i);
        }
      }, 1000);

      //res.json({message: 'Draw started'});
      return {type: 'error' ,message: 'Draw started'}
    } else {
      //res.status(400).json({message: 'Game or Draw is on!'});
      return {type: 'error' ,message: 'Game or Draw is on!'}
    }
  })
};

exports.getTime = function (callback) {
  db.game.getCurrentGame(function (err, ret) {
    console.log(ret)
  });

  if (app.timer_on && time) {
    //ret.json(time);
    callback(false, time);
  } else {
    //res.status(400).json({message: 'Timer has not started!'});
    callback(400, {message: 'Timer has not started!'})
  }
};