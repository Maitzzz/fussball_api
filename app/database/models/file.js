exports.attach = function (options) {
  var app = this;
  var Sequelize = require('sequelize');

  app.file = app.db.define('file', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      file_name: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING
      },
      content_type: {
        type: Sequelize.STRING
      }
    },
    {
      classMethods: {
        editUserProfilePicture: function (file, user, callback) {
          if (file && user) {
            callback(false, {message: 'Upload success!'});
            app.file.create({
              file_name: file.filename,
              path: file.path,
              content_type: file.mimetype
            }).then(function (ret) {
              app.user.update({
                image: ret.dataValues.id
              }, {
                where: {
                  user_id: user.user_id
                }
              })
            })

          } else {
            callback(400, {message: 'Upload failed!'});
          }
        }
      }
    });
};