exports.attach = function (options) {
  var app = this;

  app.server.get("/test", function (req, res) {
    var players = {};
    app.game.creategame(players, function(ret) {
      console.log("ret")
      console.log(ret);
      res.json(ret);
    });
  });

  app.server.get("/tests", function(req, res) {
    app.test.findAll().then(function(connections) {
      res.json(connections);
    });
  });

  app.server.get("/", function (req, res) {
    res.json({ Success: "31231ddsaddassWi" });
  });
};