/**
 * Created by mait on 18.09.15.
 */
exports.attach = function (options) {
  var app = this;

  app.messages.send = function(driver, conf, message) {
    switch (driver) {
      case 'timer':

        break;
    }
  }
};
