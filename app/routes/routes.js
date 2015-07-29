exports.attach = function (options) {
  var app = this;

  app.server.post("/test", function (req, res) {
    var test = {};

    test.testname = req.body.name;

    app.test.create(test).then(function(tests) {
        res.json(tests);
    });

    res.json({ Success: "Success!?" })
  });

  app.server.get("/tests", function(req, res) {
    app.test.findAll().then(function(connections) {
      res.json(connections);
    });
  });

  app.server.get("/", function (req, res) {
    res.json({ Success: "Welcome to api" });
  });
};