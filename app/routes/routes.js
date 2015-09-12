exports.attach = function (options) {
  var app = this;

  app.server.get("/test", function (req, res) {
    app.goal.goalScored(1,1, function(ret) {
      res.json(ret);
    });
  });

  app.server.get("/addgoal", function (req, res) {
    app.goal.create({
      match: 1,
      owner: 1
    });
    res.json('tete');
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