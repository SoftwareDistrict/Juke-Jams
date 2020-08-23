import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import ListEntryParty from './listEntry.js';

// Song search list
const SearchResultsParty = ({ videos, listClickHandler }) => {
  console.log(partyClickHandler, 'im inside of searchResultParty')
  return (
    <ListGroup style={{ padding: "5%" }}> 
    <div>
      {videos.map((video) => (
        <ListEntryParty video={video} listClickHandler={listClickHandler} />
      ))}
    </div>
    </ListGroup>
  );
};

export default SearchResultsParty;
