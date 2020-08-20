import React from 'react';

// User playlist
const Playlist = ({ userPlaylist, deleteSong }) => {
  return (
    <div>
      <h3 style={{ 
        color: "black", backgroundColor: "#ECEBEB", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 100, textAlign: "center", padding: "10px 20px"
        }}>Your Playlist:</h3>
      <ul>
        {userPlaylist.map((video, index) => (
          <li key={index} onClick={() => deleteSong(video, index)}>{video.snippet.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
