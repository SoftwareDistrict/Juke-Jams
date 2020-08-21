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
  // invitees,
  addASub,
  accessCode,

  currentId
}) => {
  

  const hostiD = function (accessCode) {
    if (accessCode === null) {
      return "i am an empty accesscode"
    } else {
      return Number(accessCode[accessCode.length - 1]);
    }
  }
      // setting state that will contain the current playlist being used in partypage

      const [newPartyPlaylist, setPlaylist] = useState(partyPlaylist)
      

  const [showSearchComp, setShowSearchComp] = useState(false);
  // const [ showInvitees, setShowInvitees ] = useState(false);


  const partyClickHandler = (video) => {
   const id = hostiD(accessCode);
  //   if (admin) {
  //     id = currentId;
  //   } else{
  //     id = hostiD();
  //   }
  
  
      postPlaylist({
        url: video.id.videoId,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.default.url,
      }, id)
      .then(({ data }) => {
    
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

  const buttonText = hostPartyClicked ? 'Drop Hosted Party' : 'Leave Party';
//IF ADMIN
if(admin){
return(

  <div>
  <div style={{ color: "black", backgroundColor: "white", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 60, textAlign: "center", padding: "10px 20px" }}>
    Your Party Access Code is: {`${accessCode}`}</div>
  <VideoPlayer video={video} nowPlaying={nowPlaying} />
  <Button>ADMIN</Button> 
       <div>
      {/* <div>
        <ul id='inviteesDisplay'>{invitees}</ul>
      </div> */}
      {/* <button onClick={setShowInvitees(!showInvitees)}>Invites</button> */}
      <Button onClick={()=> setShowSearchComp(!showSearchComp)}>Make a Search</Button><br/>
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
   
  <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
</div>
);

}


//IF INVITEE WITH PRIVS
else if(adminSub){
  return(
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
        <Queue newPartyPlaylist={newPartyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} votes={votes} />
      </div>
     
    <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
  </div>
  );
          
  
  }else{
    return(
      
      <div>
      <div><VideoPlayer video={video} nowPlaying={nowPlaying} /> </div>
      <Button>INVITEE WITH NO PRIVS</Button> 
      <div><Button id="subscirbe" onClick={() => addASub()}>Subscribe</Button></div> 
           <div>
          
          <Queue newPartyPlaylist={newPartyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} votes={votes} />
        </div>
       
      <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
    </div>
    );
  }



}






// //IF INVITEE WITHOUT PRIVS
//   return (
//     <div>
//       <button onClick={onClick}>CLICK MEEEE</button>

//       <div style={{ color: "black", backgroundColor: "white", fontFamily: "Big Shoulders Display", textalign: "center", fontSize: 20, fontWeight: 60, textAlign: "center", padding: "10px 20px" }}>
//         Your Party Access Code is: {`${accessCode}`}</div>
//       {!admin ? <div><button id="subscirbe" onClick={() => addASub()}>Subscribe</button></div> : <div></div>}
//       <VideoPlayer video={video} nowPlaying={nowPlaying} /> 
//       {admin ? (
//         <div>
//           {/* <div>
//             <ul id='inviteesDisplay'>{invitees}</ul>
//           </div> */}
//           {/* <button onClick={setShowInvitees(!showInvitees)}>Invites</button> */}
//           <button onClick={()=> setShowSearchComp(!showSearchComp)}>Make a Search</button><br/>
//           {showSearchComp ? (
//             <div>
//               <SearchParty searchHandler={searchHandler} />
//               <SearchResultsParty videos={videos} listClickHandler={partyClickHandler} userPlaylist={userPlaylist}/>
//             </div>
//             ) : (
//               <div></div>
//             )}
//           <Queue newPartyPlaylist={newPartyPlaylist} partyClickHandler={partyClickHandler} voteUpdate={voteUpdate} votes={votes} />
//         </div>
//       ) : (
//         <div></div>
//       )}
//       <Button onClick={() => dropHostParty()}>{buttonText}</Button>{' '}
//     </div>
//   );
// };

export default PartyPage;
