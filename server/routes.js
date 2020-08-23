// Login route
require('dotenv').config();
const twilio = require('twilio');
const { TWL_CELL, ACC_SID_TWL, AUTH_TOK_TWL } = require('../config.js');
const { Router } = require('express'); 
const router = Router();
const client = new twilio(ACC_SID_TWL, AUTH_TOK_TWL); 
const {
    Playlist,
    PlaylistSong,
    User,
    Song,
    Party,
    PartySongUser,
    Invitee
  } = require('../db/database.js');

// SEND ACCESS CODE
router.post('/invites', (req, res) => {
  const { msg, cell } = req.body;
  client.messages.create({ 
    body: msg, 
    from: TWL_CELL,       
    to: cell
  }) 
  .then(message => console.log(message.sid)) 
  .done();
});

// GET PHONE NUMBER
router.get('/findinvites/:id', async(req, res) => {
  const hostId = req.params.id;
  await Invitee.findAll({ where: { id_host: hostId } })
  .then((response) => res.status(200).send(response))
  .catch(err => {
    res.sendStatus(500);
    console.error('could not get all invitees: ', err);
  });
});

// ADD AN INVITEE
router.post('/subscribe', async (req, res) => {
  const options = req.body;
  console.log('options: ', options);
  await Invitee.findAll({where: {id_user: options.id_user, id_host: options.id_host}})
  .then(res => {
    if(res.length){
      console.log('User already subbed to host');
    }else{
      Invitee.create(options)
      .then(() => console.log('added that Sub BABYYYY'))
      .catch((err) => console.error('that did not add the sub: ', err))
    }
  });
});

//Login route
router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user === null) {
    await User.create(req.body)
      .then((dbResponse) => {
        res.send({ user: dbResponse });
      });
  } else {
    const playlist = await Playlist.findOne({ where: { userId: user.id } });
    if (playlist) {
      // eslint-disable-next-line max-len
      const playlistSongs = await PlaylistSong.findAll({ where: { playlistId: playlist.id }, raw: true });
      if (playlistSongs) {
        const songs = playlistSongs.map((song) => Song.findByPk(song.songId, { raw: true }));
        await Promise.all(songs).then((mapped) => res.send({ user, songs: mapped }));
        return;
      }
    }
    res.send({ user });
  }
});

router.post('/postCell', async (req, res) => {
  const { id, cell } = req.body;
  if (cell.length === 10) {
    User.update({ cell }, { where: { id } })
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err));
  } else {
    res.status(500).send('post request for cell did not work');
  }
});

router.post('/checkCell', async (req, res) => {
  const { id } = req.body;
  User.findOne({ where: { id } })
  .then((data) => {
    const row = data.dataValues;
    if (row.cell === null) {
      res.send({ bool: false, cell: null });
    } else {
      res.send({ bool: true, cell: row.cell });
    }
  });
});

// Update votes
router.put('/vote', async (req, res) => {
  const { url, direction, accessCode, reset, userId } = req.body;
  const party = await Party.findOne({ where: { accessCode } });
  const playlist = await Playlist.findOne({ where: { userId: party.hostId } });
  const song = url && await Song.findOne({ where: { url } });
  if (reset === true) {
    await PartySongUser.destroy({ where: { partyId: party.id } });
    await party.destroy();
    const playlistSongs = await PlaylistSong.findAll({ where: { playlistId: playlist.id } }, { raw: true });
    await Promise.all(playlistSongs.map((song) => song.update({ vote: null })))
      .then(() => res.sendStatus(200))
      .catch((err) => console.error('Promise in .put/vote: ', err));
  } else {
    const playlistSong = await PlaylistSong.findOne({ where: { songId: song.id, playlistId: playlist.id } });
    const voteObj = { vote: playlistSong.vote || 0 };
    if (direction === 'up') {
      voteObj.vote++;
    } else if (direction === 'down' && voteObj.vote !== 0) {
      voteObj.vote--;
    } else {
      res.send({ newVoteCount: voteObj.vote });
      return;
    }
    const partySongUser = await PartySongUser.findOne({ where: { partyId: party.id, songId: song.id, userId } });
    if (partySongUser === null) {
      PartySongUser.create({ partyId: party.id, songId: song.id, userId });
      playlistSong.update(voteObj)
        .then(() => {
          res.send({ newVoteCount: playlistSong.vote });
        });
    } else {
      res.send({ newVoteCount: playlistSong.vote });
    }
  }
});

// Get the playlist of a party
// Done by access code
router.get('/party/:code', async (req, res) => {
  const accessCode = req.params.code;

  const party = await Party.findOne({ where: { accessCode } });
  if (party !== null) {
    const playlist = await Playlist.findOne({ where: { userId: party.hostId } });

    const playlistSongs = await PlaylistSong.findAll({ where: { playlistId: playlist.id } }, { raw: true });

    const songsWithDetails = playlistSongs.map((song) => Song.findByPk(song.songId, { raw: true }));

    await Promise.all(songsWithDetails).then((result) => {
      res.send(result.map((song, index) => {
        const nowPlaying = song.url === party.nowPlaying;
        return { song, vote: playlistSongs[index].vote || 0, nowPlaying, playlist };
      }));
    });
  } else {
    res.sendStatus(500);
  }
});

// Create host and party
router.post('/host', async (req, res) => {
  const { host, id } = req.body;
  const user = await User.findByPk(id);
  const party = await Party.findOne({ where: { hostId: id } });
  if (host === false) {
    user.update({ hostedPartyId: null });
    res.sendStatus(200);
  } else if (party === null) {
    let accessCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
      accessCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    accessCode += accessCode.concat(id);
    Party.create({ hostId: id, accessCode })
      .then(({ dataValues }) => {
        user.update({ hostedPartyId: dataValues.id });
        res.send(accessCode);
      });
  } else {
    res.send(party.accessCode);
  }
});

// Playlist creation
router.post('/playlist/:user', async (req, res) => {
  const userId = req.params.user;
  const { url, del } = req.body;

  let song = await Song.findOne({ where: { url } }); // Look for song in the db
  let alreadyExists = false;

  if (song === null && !del) {
    await Song.create(req.body) // Create entry if its not there
      .then(({ dataValues }) => {
        song = dataValues; // Save the song the db generated
      });
  }

  let playlist = await Playlist.findOne({ where: { userId } }); // Look for existing playlist for current user

  if (playlist === null && !del) {
    await Playlist.create({ userId }) // Create playlist if user doesn't have one
      .then(({ dataValues }) => {
        playlist = dataValues; // Save the playlist ID generated by the db
      });
  }

  const playlist_song = await PlaylistSong.findOne({ where: { playlistId: playlist.id, songId: song.id } });
  if (del) {
    playlist_song.destroy();
    res.sendStatus(200);
    return;
  }
  if (playlist_song === null) {
    PlaylistSong.create({ playlistId: playlist.id, songId: song.id });
  } else {
    alreadyExists = true;
  }

  res.send(alreadyExists); // Tell client if song was already in the database
});

// Update the party's currently playing video according to access code
router.put('/party', async (req, res) => {
  const { nowPlaying, accessCode } = req.body;
  await Party.update({ nowPlaying }, { where: { accessCode } });
  res.sendStatus(200);
});

router.post('/invites/:id', async (req, res) => {
  const { id } = req.params;
  const { admin_status, id_host } = req.body;
  await Invitee.update({ admin_status }, {where:{id: id}})
  .then(() => {
    return Invitee.findAll({where: {id_host: id_host}})
  })
  .then(resp => {
    res.send(resp);
  })
  .catch(err => console.error('UpdateInvitee: ', err))
})

module.exports = {
  router,
};
