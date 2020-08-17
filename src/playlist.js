import React from 'react';

// import ListEntry from './listEntry.js';

const Playlist = ({ userPlaylist, deleteSong }) => {
  // console.log(videos);
  return (
    <div>
      <h3 style={{ 
        color: "black", backgroundColor: "#ECEBEB", fontFamily: "verdana", textalign: "center", fontSize: 20, fontWeight: 100, textAlign: "center", padding: "10px 20px"
        }}>Your Playlist:</h3>
      <ul>
        {userPlaylist.map((video, index) => (
          <li onClick={() => deleteSong(video, index)}>{video.snippet.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
