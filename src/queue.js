import React from 'react';
import QueueEntry from './queueEntry.js';
import ListGroup from "react-bootstrap/ListGroup";

// Host Playlist
const Queue = ({ partyPlaylist, partyClickHandler, sortPlaylist, voteUpdate, votes, queueClickHandler }) => {

  return (
    <ListGroup style={{ padding: "5%" }}>
    <div>
      {partyPlaylist.map((video) => {
       return <QueueEntry video={video} partyClickHandler={partyClickHandler} sortPlaylist={sortPlaylist} voteUpdate={voteUpdate} votes={votes} queueClickHandler={queueClickHandler}/>
        }
      )}
    </div>
    </ListGroup>
  );
};

export default Queue;
