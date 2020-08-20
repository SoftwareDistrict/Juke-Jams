import React from 'react';
import Button from 'react-bootstrap/Button';

// Song search
const SearchParty = ({ searchHandler }) => {
  return (
    <div style={{ fontWeight: "bold", fontFamily: "verdana"}}>
      Add a song to que:
      <input onChange={searchHandler} />
      <Button onClick={() => searchHandler('click')}>Search</Button>
    </div>
  );
};

export default SearchParty;
