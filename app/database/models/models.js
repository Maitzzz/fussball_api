exports.attach = function(options) {
  var app = this;
  var Sequelize = require('sequelize');

  var game, goal, match, team, user, matches;

  game = Sequelize.define('Game', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    matches: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Matches',
        key: 'id'
      }
    }
  });

  matches = Sequelize.define('Matches', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    match_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Match',
        key: 'id'
      }
    },
    game_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Game',
        key: 'id'
      }
    }
  });

  match = Sequelize.define('Match', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    start: {
      type: Sequelize.TIME
    },
    end: {
      type: Sequelize.TIME
    },
    side: {
      type: Sequelize.STRING
    },
    winning_team: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Team',
        key: 'id'
      }
    },
    team_one: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Team',
        key: 'id'
      }
    },
    team_two: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Team',
        key: 'id'
      }
    }
  });

  goal = Sequelize.define('Goal', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    owner: {
      type: Sequelize.INTEGER,
      references: {
        user: 'User',
        key: 'id'
      }
    },
    match_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Match',
        key: 'id'
      }
    }
  });

  team = Sequelize.define('Team', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    player_one: {
      type: Sequelize.INTEGER,
      references: {
        user: 'User',
        key: 'id'
      }
    },
    player_two: {
      type: Sequelize.INTEGER,
      references: {
        user: 'User',
        key: 'id'
      }
    }
  });

  user = Sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    type: {
      type: Sequelize.INTEGER
    },
    active: {
      type: Sequelize.BOOLEAN
    }
  });

  app.game = game;
  app.goal = goal;
  app.match = match;
  app.team = team;
  app.user = user;
  app.matches = matches;
};