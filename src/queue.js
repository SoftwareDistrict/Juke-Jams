import React from 'react';
import QueueEntry from './queueEntry.js';
import ListGroup from "react-bootstrap/ListGroup";

// Host Playlist
const Queue = ({ newPartyPlaylist, partyClickHandler, sortPlaylist, voteUpdate, votes }) => {

  return (
    <ListGroup style={{ padding: "5%" }}>
    <div>
      {newPartyPlaylist.map((video) => {
       return <QueueEntry video={video} partyClickHandler={partyClickHandler} sortPlaylist={sortPlaylist} voteUpdate={voteUpdate} votes={votes} />
        }
      )}
    </div>
    </ListGroup>
  );
};

export default Queue;
