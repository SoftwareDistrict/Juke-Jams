const axios = require('axios');

var tag = document.createElement('script');

function getNextVid() {
  return axios.get(`https://localhost:8080/party/${accessCode}`)
}

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        // console.log('onYouTubeIframeAPIReady() was called');
        window.ytPlayer = new YT.Player('player', {
          height: '390',
          width: '640',
          // videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        // event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      // var done = false;
      // let queueFromServer;
      let songsPlayed = {}
      let currentSongIndex = 0;

      function onPlayerStateChange(event) {
        axios.put(`https://plated-planet-286900.uc.r.appspot.com/party/`, {
          nowPlaying: window.ytPlayer.getVideoData()['video_id'],
          accessCode
        })
        if (event.data === 0) { // If video ended
          songsPlayed[window.ytPlayer.getVideoData()['video_id']] = 'played' // Save song id to avoid repeat
          getNextVid() // Check with db for vote changes
          .then(({ data }) => {
            function byVotes(a, b) {
              if (a.vote > b.vote) return -1;
              if (a.vote < b.vote) return 1;
              return 0;
            }
            const queueFromServer = data.sort(byVotes) // Sort by votes
            let currentSong = queueFromServer[currentSongIndex];

            while (currentSong && songsPlayed.hasOwnProperty(currentSong.song.url)) { // Check to see if song played already
              currentSongIndex++
              currentSong = queueFromServer[currentSongIndex]
            }
            if (currentSong) { // If end of playlist hasn't yet been reached
              window.ytPlayer.loadVideoById(currentSong.song.url);
              currentSongIndex++
            } else {
              songsPlayed = {}
              // currentSongIndex = 0
            }
          })
          .catch((err) => {
            console.error('there was an error', err);
          })
        }
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //   setTimeout(stopVideo, 6000);
        //   done = true;
        // }
      }
      // function stopVideo() {
      //   player.stopVideo();
      // }
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;