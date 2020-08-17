import React from 'react';
import QueueEntry from './queueEntry.js';
import ListGroup from "react-bootstrap/ListGroup";

// Host Playlist
const Queue = ({ partyPlaylist, listClickHandler, sortPlaylist, voteUpdate, votes }) => {
  return (
    <ListGroup style={{ padding: "5%" }}>
    <div>
      {partyPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} voteUpdate={voteUpdate} votes={votes} />
      ))}
    </div>
    </ListGroup>
  );
};

export default Queue;
