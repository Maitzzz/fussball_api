var broadway = require('broadway');
var app = new broadway.App();

console.log('test');
app.conf = require('config').get('app');

app.use(require('./database/database.js'));
app.use(require('./server/server.js'));

app.init(function (err) {
  if (err) console.log(err);
});