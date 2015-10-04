exports.attach = function (options) {
  var app = this;

  app.wss.broadcast = function broadcast(data) {
    for(var i in this.clients) {
      this.clients[i].send(JSON.stringify(data));
      app.winston.log('info', 'Websocket message sent', data, i);
    }
  };

  app.wss.on('connection', function connection(ws) {

  });
};

