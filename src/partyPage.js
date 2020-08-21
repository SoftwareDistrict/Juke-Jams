// import React from 'react';
import React, { useState } from 'react';
import Queue from './queue.js';
import VideoPlayer from './videoPlayer.js';
import Button from 'react-bootstrap/Button';
import SearchResultsParty from './searchResults'
import SearchParty from './searchParty'
import { postPlaylist } from './axiosRequests'


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
  searchHandler,
  userCell,
  invitees,
  addASub,
  grabInvitees,
  currentId
}) => {
      console.log(partyPlaylist, 'im a prop in partypage');
      console.log(userPlaylist, 'im userPlaylist prop')
      // setting state that will contain the current playlist being used in partypage

      const [newPartyPlaylist, setPlaylist] = useState(partyPlaylist)
      console.log(newPartyPlaylist, 'im the new playlist')

  const [showSearchComp, setShowSearchComp] = useState(false);
  // const [ showInvitees, setShowInvitees ] = useState(false);

  const partyClickHandler = (video) => {
    
    // if (hostPartyClicked) {
     
    // } 
    console.log('partyclick handler CLIIIICKED')
      postPlaylist({
        url: video.id.videoId,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.default.url,
      }, currentId)
      .then(({ data }) => {
        console.log(data, 'party page data postPlaylist DATABASE')
        if (data === false) {
          // If song doesn't already exist in database
          // this.setState({
          //   userPlaylist: userPlaylist.concat([video]),
          //   video: userPlaylist[0],
          // });

          setPlaylist(newPartyPlaylist.concat([video]))
        }
      })
      .catch((err) => console.log('listClickHandler: ', err));
    
  }
console.log(partyClickHandler, ' am i not a freaking function')
  const buttonText = hostPartyClicked ? 'Drop Hosted Party' : 'Leave Party';
  return (
    <div>
      <div style={{ color: "black", backgroundColor: "white", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 60, textAlign: "center", padding: "10px 20px" }}>
        Your Party Access Code is: {`${accessCode}`}</div>
      <div>
        <Button id="subscirbe" onClick={() => addASub()}>Subscribe</Button>
      </div>
      <VideoPlayer video={video} nowPlaying={nowPlaying} />
      {admin ? (
        <div>
          {/* <div>
            <ul id='inviteesDisplay'>{invitees}</ul>
          </div> */}
          {/* <Button onClick={setShowInvitees(!showInvitees)}>Invites</Button> */}
          <div>
            <Button onClick={()=> setShowSearchComp(!showSearchComp)}>Make a Search</Button><br/>
          </div>
          {showSearchComp ? (
            <div>
              <SearchParty searchHandler={searchHandler} />
              <SearchResultsParty videos={videos} listClickHandler={partyClickHandler} userPlaylist={userPlaylist}/>
            </div>
            ) : (
              <div></div>
            )}
          <Queue newPartyPlaylist={newPartyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} votes={votes} />
        </div>
      ) : (
        <div></div>
      )}
      <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
    </div>
  );
};

export default PartyPage;
