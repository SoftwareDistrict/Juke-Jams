import React from 'react';

const VideoPlayer = ({ video, nowPlaying }) => {
  if (nowPlaying) {
    return (
      <div>
        Now Playing: {`${nowPlaying.title} by ${nowPlaying.artist}`}
      </div>
      );
    };
  return <div></div>
  };

export default VideoPlayer;
