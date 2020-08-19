import React from 'react';
import Queue from './queue.js';
import VideoPlayer from './videoPlayer.js';
import Button from 'react-bootstrap/Button';
import SearchResults from './searchResults'
import Search from './search'


// Party page
const PartyPage = ({
  video,
  userPlaylist,
  hostPartyClicked,
  toggleHost,
  dropHostParty,
  HostParty,
  listClickHandler,
  voteUpdate,
  clickHostParty,
  nowPlaying,
  partyPlaylist,
  votes,
  admin,
  adminSub,
  videos,
  searchHandler
}) => {
  const buttonText = hostPartyClicked ? 'Drop Hosted Party' : 'Leave Party';
  return (
    <div style={{ color: "black", backgroundColor: "white", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 60, textAlign: "center", padding: "10px 20px" }}>
      Your Party Access Code is: {`${accessCode}`}
      <VideoPlayer video={video} nowPlaying={nowPlaying} />
      {admin ? <div><Search searchHandler={searchHandler} />
      <SearchResults
        videos={videos}
        listClickHandler={listClickHandler}
        userPlaylist={userPlaylist}
      /></div> : <div></div>}
      <Queue
        partyPlaylist={partyPlaylist}
        listClickHandler={listClickHandler}
        voteUpdate={voteUpdate}
        votes={votes}
      />
          <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
    </div>
  );
};

export default PartyPage;
