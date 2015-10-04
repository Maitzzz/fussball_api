exports.attach = function (options) {
  var app = this;

  app.wss.broadcast = function broadcast(data) {
    for(var i in this.clients) {
      this.clients[i].send(JSON.stringify(data));
      //app.winston.log('info', 'Websocket message sent', data, i);
    }
  };

  app.wss.on('connection', function connection(ws) {

    app.draw.getState(function(ret) {
      if (ret == 'game') {
        console.log(ret)
          app.pushMessages('websocket', {type: 'status', status: ret})
          app.draw.pushGameData();
      } else {
        app.pushMessages('websocket', {type: 'status', status: ret})
      }
    });
  });
};

