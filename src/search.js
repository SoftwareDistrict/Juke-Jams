import React from 'react';
import Button from 'react-bootstrap/Button';

// Song search
const Search = ({ searchHandler }) => {
  return (
    <div style={{ fontWeight: "bold", fontFamily: "verdana"}}>
      Add a Song:
      <input onChange={searchHandler} />
      <Button onClick={() => searchHandler('click')}>Search</Button>
    </div>
  );
};

export default Search;
