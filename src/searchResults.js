import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import ListEntry from './listEntry.js';

// Song search list
const SearchResults = ({ videos, listClickHandler }) => {
  return (
    <ListGroup style={{ padding: "5%" }}> 
    <div>
      {videos.map((video) => (
        <ListEntry video={video} listClickHandler={listClickHandler} />
      ))}
    </div>
    </ListGroup>
  );
};

export default SearchResults;
