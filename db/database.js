// require('dotenv').config();
const Sequelize = require('sequelize');
const {
  DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT,
} = require('../config');

// DB connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: 'mysql',
  host: DB_HOST,
});

// Tables

const User = sequelize.define('User', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  hostedPartyId: Sequelize.INTEGER,
  cell: Sequelize.TEXT,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
});

// const Invitee = sequelize.define('User', {
//   id_host: Sequelize.INTEGER,
//   id_user: Sequelize.INTEGER,
//   admin_status: Sequelize.STRING,
//   user_firstName: Sequelize.STRING,
//   user_lastName: Sequelize.STRING,
//   user_cell: Sequelize.TEXT,
// });

const Song = sequelize.define('Song', {
  url: {
    type: Sequelize.STRING,
    unique: true,
  },
  title: Sequelize.STRING,
  artist: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
});

const Playlist = sequelize.define('Playlist', {
  userId: {
    type: Sequelize.INTEGER,
    unique: true,
    references: {
      model: 'Users',
      referencesKey: 'id',
    },
  },
});

const PlaylistSong = sequelize.define('PlaylistSong', {
  playlistId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Playlists',
      referencesKey: 'id',
    },
  },
  songId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Songs',
      referencesKey: 'id',
    },
  },
  vote: Sequelize.INTEGER,
});

const Party = sequelize.define('Party', {
  hostId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      referencesKey: 'id',
    },
  },
  accessCode: Sequelize.STRING,
  nowPlaying: Sequelize.STRING,
});

const PartySongUser = sequelize.define('PartySongUser', {
  partyId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Parties',
      referencesKey: 'id',
    },
  },
  songId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Songs',
      referencesKey: 'id',
    },
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      referencesKey: 'id',
    },
  },
});

// Queries
// sequelize
//   .query('DROP DATABASE IF EXISTS greenfield')
//   .then(() => sequelize.query('CREATE DATABASE greenfield'))
// .then(() =>
sequelize.query('USE greenfield')
  .then(() => {
    const User = sequelize.define('User', {
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      hostedPartyId: Sequelize.INTEGER,
      cell: Sequelize.TEXT,
      email: Sequelize.STRING,
    });

    const Song = sequelize.define('Song', {
      url: Sequelize.STRING,
      title: Sequelize.STRING,
      artist: Sequelize.STRING,
      thumbnail: Sequelize.STRING,
    });

    const Playlist = sequelize.define('Playlist', {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          referencesKey: 'id',
        },
      },
    });

    const PlaylistSong = sequelize.define('PlaylistSong', {
      playlistId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Playlists',
          referencesKey: 'id',
        },
      },
      songId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Songs',
          referencesKey: 'id',
        },
      },
      vote: Sequelize.INTEGER,
    });

    const Party = sequelize.define('Party', {
      hostId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          referencesKey: 'id',
        },
      },
      accessCode: Sequelize.STRING,
      nowPlaying: Sequelize.STRING,
    });

    const PartySongUser = sequelize.define('PartySongUser', {
      partyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Parties',
          referencesKey: 'id',
        },
      },
      songId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Songs',
          referencesKey: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          referencesKey: 'id',
        },
      },
    });

    //Invitee.sync({ force: true });
    Song.sync({ force: true });
    User.sync({ force: true })
      .then(() => {
        Playlist.sync({ force: true });
        PlaylistSong.sync({ force: true });
        Party.sync({ force: true });
        PartySongUser.sync({ force: true });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = {
  User,
  Song,
  Playlist,
  PlaylistSong,
  Party,
  PartySongUser,
};
