// require('dotenv').config();
const axios = require('axios');
// const { PORT } = process.env;
// const { URL } = require('../config');
// const URL = 'https://jukejams.herokuapp.com';
// const PORT = 42368;
const URL = 'http://localhost:8080';

const postCell = (cell) => axios.post(`${URL}/postCell`, cell);

const getInvitees = (hostId) => axios.get(`${URL}/findinvites/${hostId}`);

const addInvitee = (options) => axios.post(`${URL}/subscribe`, options);

const getCellBoolAndCellNum = (id) => axios.post(`${URL}/checkCell`, {id: id});

const getParty = (accessCode) => axios.get(`${URL}/party/${accessCode}`);

const putVotes = (options) => axios.put(`${URL}/vote/`, options);

const postHost = (options) => axios.post(`${URL}/host`, options);

const postLogin = (options) => axios.post(`${URL}/login`, options);

const getYouTube = (options) => axios.get('https://www.googleapis.com/youtube/v3/search', options);

const postPlaylist = (options, currentId) => axios.post(`${URL}/playlist/${currentId}`, options);

// const putPlaylist = (options) => {
//   console.log('inside the put function');
//   return axios.put(`${URL}/playlist/`, options);
// }

module.exports = {
  getInvitees,
  getParty,
  putVotes,
  postHost,
  postLogin,
  getYouTube,
  postPlaylist,
  postCell,
  getCellBoolAndCellNum,
  addInvitee,
  // putPlaylist
};
