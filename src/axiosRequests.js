// require('dotenv').config();
const axios = require('axios');
// const { PORT } = process.env;
// const { URL } = require('../config');
//const URL = 'https://jukejams.herokuapp.com';
// const PORT = 42368;
 const URL = 'http://localhost:8080'


const getParty = (accessCode) => {
  return axios.get(`${URL}/party/${accessCode}`)
}

const putVotes = (options) => {
  return axios.put(`${URL}/vote/`, options);
}

const postHost = (options) => {
  return axios.post(`${URL}/host`, options)
}

const postLogin = (options) => {
  return axios.post(`${URL}/login`, options)
}

const getYouTube = (options) => {
  return axios.get('https://www.googleapis.com/youtube/v3/search', options)
}

const postPlaylist = (options, currentId) => {
  return axios.post(`${URL}/playlist/${currentId}`, options);
}

// const putPlaylist = (options) => {
//   console.log('inside the put function');
//   return axios.put(`${URL}/playlist/`, options);
// }

module.exports = {
  getParty,
  putVotes,
  postHost,
  postLogin,
  getYouTube,
  postPlaylist,
  // putPlaylist
};