import React, { useState } from 'react';
import Queue from './queue.js';
import VideoPlayer from './videoPlayer.js';
import Button from 'react-bootstrap/Button';
import SearchResultsParty from './searchResults'
import SearchParty from './searchParty'
import { postPlaylist, invite } from './axiosRequests'

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
  grabInvitees,
  invitees,
  addASub,
  accessCode,
  currentId,
  updateSubAdmin,
  setSubAdmin,
  queueClickHandler
}) => {

  // setting state that will contain the current playlist being used in partypage
  // const [ partyPlaylist, setPlaylist ] = useState(partyPlaylist)
  const [ showSearchComp, setShowSearchComp ] = useState(false);
  const [ showInvitees, setShowInvitees ] = useState(false);
  const [ number, setNumber ] = useState('');

  const numberInput = (event) => {
    setNumber(event.target.value);
  };

  const sendInvite = (creds) => {
    invite(creds)
    .then(() => console.log('sent with twilio'))
    .catch(err => console.error('could not invite!!: ', err));
  };

  const partyClickHandler = (video) => {
    const id = hostiD(accessCode);  
    postPlaylist({
      url: video.id.videoId,
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.default.url,
    }, id)
    .then(({ data }) => {
      if (data === false) {
        partyPlaylist.concat([video]);
      }
    })
    .catch((err) => console.log('listClickHandler: ', err));
  };

   const hostiD = function (accessCode) {
    if (accessCode === null) {
      return "i am an empty accesscode";
    } else {
      return Number(accessCode[accessCode.length - 1]);
    }

  };
  const inviteesButton = () => {
    setShowInvitees(!showInvitees);
    grabInvitees();
  };

  const grantPriv = (status, id) => {
    invitees.map(invitee => {
      if(id === invitee.id_user) {
        setSubAdmin(true);
        updateSubAdmin(invitee.id, currentId, status);
      }
    })
  }

  const takePriv = (status, id) => {
    invitees.map(invitee => {
      if(id === invitee.id_user) {
        setSubAdmin(false);
        updateSubAdmin(invitee.id, currentId, status);
      }
    })
  }

  const buttonText = hostPartyClicked ? 'Drop Hosted Party' : 'Leave Party';

  //IF ADMIN
  if (admin) {
    return (
      <div>
        <div style={{ color: "black", backgroundColor: "white", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 60, textAlign: "center", padding: "10px 20px" }}>
          Your Party Access Code is: {`${accessCode}`}</div>
        <VideoPlayer video={video} nowPlaying={nowPlaying} />
        <Button>ADMIN</Button>
        <div>
          {showInvitees ? (
            <div> Invite Some People
              <input id="invite-input" onChange={(value) => numberInput(value)} placeholder="Type Phone Number" />
              <div><Button onClick={() => sendInvite({
                msg: accessCode,
                cell: number
              })} >SEND</Button></div>
              <ul id='inviteesDisplay'>
                {
                invitees.map(({
                  id,
                  id_host,
                  id_user,
                  admin_status,
                  user_firstName,
                  user_lastName,
                  user_cell
                }) => {
                  return (
                    <li id='invitee' key={id_user}>
                      <div>{`${user_firstName} ${user_lastName}`}</div>
                      <div>{user_cell}</div>
                      <Button id='invite-btn' onClick={() => {
                        sendInvite({
                          msg: accessCode,
                          cell: user_cell
                        });
                      }}>Invite</Button>
                      {admin_status == 0? <Button id='admin-btn' onClick={() => grantPriv(true, id_user)}>Grant Priveleges</Button>
                      : <Button id='admin-btn' onClick={() => takePriv(false, id_user)}>Take Priveleges</Button>}
                    </li>
                  );
                })}</ul>
              </div>
            ) : (
              <div></div>
          )}
          <div><Button onClick={() => {
            inviteesButton()
          }
          }>Invites</Button></div>
          <div><Button onClick={()=> setShowSearchComp(!showSearchComp)}>Make a Search</Button></div><br/>
          {showSearchComp ? (
            <div>
              <SearchParty searchHandler={searchHandler} />
              <SearchResultsParty videos={videos} listClickHandler={partyClickHandler} userPlaylist={userPlaylist}/>
            </div>
            ) : (
              <div></div>
            )}
          <Queue partyPlaylist={partyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} votes={votes} queueClickHandler={queueClickHandler} />
        </div>
        <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
      </div>
    );
  //IF INVITEE WITH PRIVS
  } else if (adminSub) {
    return (
      <div>
        <div style={{ color: "black", backgroundColor: "white", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 60, textAlign: "center", padding: "10px 20px" }}>
          Your Party Access Code is: {`${accessCode}`}</div>
        <VideoPlayer video={video} nowPlaying={nowPlaying} /> 
        <Button>SUBADMIN</Button> 
        <div>
          <Button onClick={()=> setShowSearchComp(!showSearchComp)}>Make a Search</Button><br/>
          {showSearchComp ? (
            <div>
              <SearchParty searchHandler={searchHandler} />
              <SearchResultsParty videos={videos} listClickHandler={partyClickHandler} userPlaylist={userPlaylist}/>
            </div>
            ) : (
              <div></div>
            )}
          <Queue partyPlaylist={partyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} votes={votes} queueClickHandler={queueClickHandler}/>
        </div>
        <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
      </div>
    );
  } else {
    return (
      <div>
        <div><VideoPlayer video={video} nowPlaying={nowPlaying} /> </div>
        <div><Button>INVITEE WITH NO PRIVS</Button></div> 
        <div><Button id="subscirbe" onClick={() => addASub()}>Subscribe</Button></div> 
        <div>
          <Queue partyPlaylist={partyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} queueClickHandler={queueClickHandler} votes={votes} />
        </div>
      <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
    </div>
    );
  }
}

export default PartyPage;
