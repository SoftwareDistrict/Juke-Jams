import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import {Image, ListGroupItem } from "react-bootstrap/";

// Host playlist entry
const QueueEntry = ({ video, listClickHandler, voteUpdate, sortPlaylist, votes }) => {
  return (
    <ListGroupItem action style={{padding: "5%"}}>
      <div>
        <Image src={video.snippet.thumbnails.default.url} onClick={() => listClickHandler(video)} rounded></Image>
      </div>
      <div>
        <div onClick={() => listClickHandler(video)}>{video.snippet.title}</div>
        <div>{video.snippet.channelTitle}</div>
        <div>{votes[video.id.videoId] || 0} votes</div>
        <div>
          <Button
            className="voteUp"
            onClick={() => {
              voteUpdate(video, 'up');
            }}>
            Up vote
          </Button>
          <Button
            className="voteDown"
            onClick={() => {
              voteUpdate(video, 'down');
            }}>
            Down vote
          </Button>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default QueueEntry;
