import React from 'react';
import SearchResults from './searchResults.js';
import Playlist from './playlist.js';
import Search from './search.js';
import Button from 'react-bootstrap/Button';

// User page
const UserPage = ({
  videos,
  clickHostParty,
  clickJoinParty,
  searchHandler,
  listClickHandler,
  userPlaylist,
  handleFormChange,
  handleFormSubmit,
  currentUser,
  deleteSong,
  userCell,
}) => {
  let playlist;
  if (userPlaylist.length) {
    playlist = <Playlist userPlaylist={userPlaylist} deleteSong={deleteSong} />;
  }
  console.log(25, userCell)
  return (
    <div>
      <h1 style={{ color: "black", backgroundColor: "#ECEBEB", fontFamily: 'Alfa Slab One', textalign: "center", fontSize: 75, fontWeight: 600, textAlign: "center", padding: "30px 20px" }}>
        JUKE JAMS!
      </h1>
      <div>
      <h2 style={{ textAlign: "center", fontSize: 25, fontFamily: "verdana", color: "black"}}>
    {`Welcome, ${currentUser.split(' ')[0]}!`}</h2>
    </div>
    <Button size="lg" onClick={() => clickHostParty()}>Host a Party!</Button>{' '}
      <form>
        <label>
          Enter Access Code:
          <input
            type="text"
            name="code"
            onChange={(event) => handleFormChange(event)}
          />
        </label>
          <Button onClick={clickJoinParty}>Submit</Button>
      </form>
      <Search searchHandler={searchHandler} />
      <SearchResults
        videos={videos}
        listClickHandler={listClickHandler}
        userPlaylist={userPlaylist}
      />{' '}
      <div
        style={{
          display: 'inline-block',
          width: '200px',
          height: '100px',
        }}
      >
        {' '}
        {playlist}{' '}
      </div>
    </div>
  );
};

export default UserPage;
