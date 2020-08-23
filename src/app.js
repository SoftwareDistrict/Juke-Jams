import React, { Component } from 'react';
import UserPage from './userPage.js';
import PartyPage from './partyPage.js';
import QueueEntry from './queueEntry.js';
import GoogleLogin from 'react-google-login';
import { YOUTUBE_API_KEY, OAUTH_CLIENT_ID} from '../config.js';
import { getParty, putVotes, postHost, postLogin, getYouTube, postPlaylist, getCellBoolAndCellNum, addInvitee, getInvitees, postCell, updateInvitee } from './axiosRequests'
import $ from 'jquery';
import player from './youTubeScript.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Jumbotron, OverlayTrigger, Popover } from 'react-bootstrap';
import Landing from './landing.js';
import Cell from './cell.js';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      video: {},
      hostPartyClicked: false,
      joinPartyClicked: false,
      loginComplete: false,
      currentUser: '',
      currentId: '',
      userPlaylist: [],
      partyPlaylist: [],
      redirect: false,
      nextVideo: {},
      accessCode: null,
      nowPlaying: null,
      votes: {}, 
      admin: false,
      adminSub: false,
      cellFilled: false,
      invitees: [],
      userCell: null,
      cellText: null,
    };
    this.clickHostParty = this.clickHostParty.bind(this);
    this.dropHostParty = this.dropHostParty.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.toggleHost = this.toggleHost.bind(this);
    this.listClickHandler = this.listClickHandler.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.clickJoinParty = this.clickJoinParty.bind(this);
    this.voteUpdate = this.voteUpdate.bind(this);
    this.refreshParty = this.refreshParty.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
    this.grabInvitees = this.grabInvitees.bind(this);
    this.addASub = this.addASub.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.updateSubAdmin = this.updateSubAdmin.bind(this);
    this.setSubAdmin = this.setSubAdmin.bind(this);
    this.queueClickHandler = this.queueClickHandler.bind(this);
  }

  // Toggles the initial player
  componentDidMount() {
    $('#player').toggle();
  }

  // Handle's the access code
  handleFormChange(event) {
    return this.setState({
      accessCode: event.target.value,
    });
  }

  setSubAdmin(bool) {
    this.setState({
      adminSub: bool
    })
  }

  // grab all users that have invitee status
  grabInvitees() {
    const { currentId } = this.state;
    getInvitees(currentId)
    .then(response => this.setState({ invitees: response.data }))
    .catch(err => console.error('could not get all invitees: ', err));
  }

  updateSubAdmin(id, id_host, bool) {
    const options = {
      admin_status: bool,
      id_host: id_host
    }
    updateInvitee(options, id)
    .then((response) => {
      console.log(response.data);
      this.setState({ invitees: response.data })
    })
    .catch(err => console.error('could not grab admin status: ', err));
  }

  addASub() {
    const { accessCode, userCell, currentId, currentUser } = this.state;
    const options = {
      id_host: Number(accessCode[accessCode.length - 1]),
      id_user: currentId,
      admin_status: false,
      user_firstName: currentUser.firstName,
      user_lastName: currentUser.lastName,
      user_cell: userCell,
    };
    console.log('options: ', options);
    addInvitee(options)
    .then(() => console.log('this is in app.js for add sub'))
    .catch((err) => console.error('this is in app.js for add sub: ', err));
  }

  // Join a Party click handler
  clickJoinParty() {
    const { accessCode, votes } = this.state;
    getParty(accessCode)
      .then(({ data }) => {
        const videoUrl = data[0].song.url
        let partyPlay = [];
        partyPlay = data.map((item) => {
          const { song } = item;
          if (item.nowPlaying) {
            this.setState({ nowPlaying: song });
          }
          votes[song.url] = item.vote || 0
          return {
            snippet: {
              thumbnails: { default: { url: song.thumbnail } },
              title: song.title,
              channelTitle: song.artist,
            },
            id: { videoId: song.url },
          };
        });
        window.ytPlayer.loadVideoById(videoUrl)
        $('#player').toggle();
        window.ytPlayer.playVideo();
        this.setState({partyPlaylist: partyPlay, votes, joinPartyClicked: true });
        getInvitees(Number(accessCode[accessCode.length - 1]))
        .then(({ data }) => {
          console.log(data, 'joinPartyInvitees data');
          data.forEach(invitee => {
            if(invitee.admin_status == 1 && invitee.id_user === this.state.currentId){
              this.setState({adminSub: true})
            }
          })
        })
        .catch(err => console.error('getInvitees joinParty: ', err));
        this.refreshParty(true);
      })
      .catch(err => console.error('this happened when join party: ', err));
  }

  // Host a party click handler
  clickHostParty() {
    this.setState({admin: true});
    if (this.state.video.id) {
      window.ytPlayer.loadVideoById(this.state.video.id.videoId)
      $('#player').toggle();
      window.ytPlayer.playVideo();
      this.setState({
        hostPartyClicked: !this.hostPartyClicked,
        partyPlaylist: this.state.userPlaylist
      });
      this.toggleHost();
      this.grabInvitees();
      this.refreshParty(true);
    }
  }

  // Drop party click handler
  dropHostParty() {
    this.setState({admin: false});
    this.refreshParty(false);
    if (this.state.hostPartyClicked) {
      $('#player').toggle();
      window.ytPlayer.stopVideo();
      this.setState({
        hostPartyClicked: false,
        nowPlaying: null
      });
      this.toggleHost();
      putVotes({
        url: null,
        direction: null,
        accessCode,
        reset: true
      })
    } else {
      this.setState({
        joinPartyClicked: false,
        nowPlaying: null
      })
    }
  }

  // Axios post request to toggle host status
  toggleHost() {
    const { currentId, hostPartyClicked } = this.state;
    if (!hostPartyClicked) {
      postHost({
        host: true,
        id: currentId,
      })
      .then(({ data }) => {
        this.setState({
          accessCode: data,
        });
      });
    } else {
      this.setState({
        hostPartyClicked: false,
        accessCode: null
      });
      postHost({
        host: false,
        id: currentId,
      });
    }
  }

  // Google auth response
  responseGoogle(response) {
    postLogin({
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
      host: false,
      email: response.profileObj.email,
    })
    .then(({ data }) => {
      let userPlaylist = [];
      let video = {};
      if (data.songs) {
        userPlaylist = data.songs.map((song) => {
          return {
            snippet: {
              thumbnails: { default: { url: song.thumbnail } },
              title: song.title,
              channelTitle: song.artist,
            },
            id: { videoId: song.url },
          };
        });
      }
      this.setState({
        loginComplete: !this.loginComplete,
        currentUser: {
          firstName: response.profileObj.givenName,
          lastName: response.profileObj.familyName
        },
        currentId: data.user.id,
        userPlaylist,
        video: userPlaylist[0] || video,
      });
    })
    .then(()=> {
      getCellBoolAndCellNum(this.state.currentId)
      .then((result)=> this.setState({ cellFilled: result.data.bool, userCell: result.data.cell }))
      .catch((err) => console.error('getCellAndBoolAndCellAndNum: ', err));
    });
  }

  // Refreshes votes/now playing data for party every 5 seconds
  refreshParty(bool) {
    const { votes } = this.state;
    if (bool) {
      this.refresh = setInterval(() => {
        if (window.accessCode) {
          getParty(window.accessCode)
          .then(({ data }) => {
            let partyPlay = [];
            partyPlay = data.map((item) => {
              const { song } = item;
              return {
                snippet: {
                  thumbnails: { default: { url: song.thumbnail } },
                  title: song.title,
                  channelTitle: song.artist,
                },
                id: { videoId: song.url },
              };
            });
            data.forEach(item => {
              const { song, vote, nowPlaying } = item;
              votes[song.url] = vote;
              if (nowPlaying) {
                this.setState({ nowPlaying: song });
              }
            });
            this.setState({ votes, partyPlaylist: partyPlay, userPlaylist: partyPlay });
          });
        }
      }, 5000);
    } else {
      console.log('cancelling refresh');
      clearInterval(this.refresh);
    }
  }

  // YouTube Search Helper Function
  searchHandler(e) {
    const { searchTerm } = this.state;
    if (e === 'click' && searchTerm.length) {
      getYouTube({
          params: {
            key: YOUTUBE_API_KEY,
            q: searchTerm,
            maxResults: 5,
            type: 'video',
            videoEmbeddable: true,
            part: 'snippet',
          },
        })
        .then(({ data }) => {
          this.setState({
            videos: data.items,
            // video: data.items[0],
          });
        })
        .catch((err) => {
          console.error('searchHandler App.js: ', err);
        });
    } else {
      this.setState({
        searchTerm: e.target.value,
      });
    }
  }

  // Handles clicks on youtube search results list
  listClickHandler(video) {
    console.log(video, 'video from clicklist handler');
    const { hostPartyClicked, currentId, userPlaylist } = this.state;
    if (hostPartyClicked) {

      this.setState({ video });
      window.ytPlayer.loadVideoById(video.id.videoId);
    } else {

      postPlaylist({
        url: video.id.videoId,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.default.url,

      }, currentId)
      .then(({ data }) => {
        if (data === false) {
          // If song doesn't already exist in database
          this.setState({
            userPlaylist: userPlaylist.concat([video]),
            video: userPlaylist[0],
          });
        }
      })
      .catch((err) => console.error('listClickHandler: ', err));
    }
  }
  // Updates vote count in state and on db
  voteUpdate(video, direction) {
    const { currentId, accessCode, votes } = this.state;
    putVotes({
      userId: currentId,
      url: video.id.videoId,
      direction,
      accessCode
    })
    .then(({ data }) => {
      votes[video.id.videoId] = data.newVoteCount || 0
      this.setState({
        votes
      })
    });
  }
  // Deletes song from state and db
  deleteSong(video, index) {
    const { userPlaylist, currentId } = this.state;
    postPlaylist({
      url: video.id.videoId,
      del: true,
    }, currentId)
    .then(() => {
      userPlaylist.splice(index, 1)
      this.setState({
        userPlaylist
      })
    })
  }

  queueClickHandler (video) {
    console.log(video);
    this.setState({ video });
    window.ytPlayer.loadVideoById(video.id.videoId)
  };

  changeHandler (event) {
      this.setState({ cellText: event.target.value });
  }


  render() {
    const {
      videos,
      hostPartyClicked,
      joinPartyClicked,
      video,
      loginComplete,
      userPlaylist,
      accessCode,
      currentUser,
      currentId,
      nowPlaying,
      partyPlaylist,
      votes,
      admin,
      adminSub,
      cellFilled,
      userCell,
      cellText,
      invitees,
    } = this.state;
    window.accessCode = accessCode;

  // if hostParty is clicked, render the Party Page
    if (hostPartyClicked || joinPartyClicked) {
      return (
        <PartyPage
          video={video}
          accessCode={accessCode}
          partyPlaylist={partyPlaylist}
          hostPartyClicked={hostPartyClicked}
          dropHostParty={this.dropHostParty}
          listClickHandler={this.listClickHandler}
          toggleHost={this.toggleHost}
          voteUpdate={this.voteUpdate}
          nowPlaying={nowPlaying}
          votes={votes}
          admin={admin}
          adminSub={adminSub}
          videos={videos}
          searchHandler={this.searchHandler}
          userCell={userCell}
          grabInvitees={this.grabInvitees}
          invitees={invitees}
          addASub={this.addASub}
          currentId={currentId}
          userPlaylist={userPlaylist}
          grabInvitees={this.grabInvitees}
          updateSubAdmin={this.updateSubAdmin}
          setSubAdmin={this.setSubAdmin}
          queueClickHandler={this.queueClickHandler}
        />
      );
    }

  // If the login is not complete, then render the google auth again
    if (!loginComplete) {
      const login = (
        // Google auth
        <GoogleLogin
          clientId={OAUTH_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      );
      return <Landing login={login} />;
    }

    // before we hit the user page, need to check if user has cellphone field filled out
    // Renders the access code route and user page upon login
    if (!cellFilled) {
      return (
        <div>
          <label className='CellNumber'>Enter your cell number:</label>
          <input type="tel" id="phone" onChange={this.changeHandler} name="phone" />
          <small>Format: 5044567890</small><br/>
          <Button onClick={()=> {
            postCell({ id: currentId, cell: cellText })
            .then(() => this.setState({ cellFilled: true, userCell: cellText }))
            }}>Submit</Button>
        </div>
      );
    } else {
      return (
        <Container style={{ display: "flex", justifyContent: 'center', border: "8px solid #cecece" }}>
        <Row style={{ padding: "5px" }}>
          <Col>
              <UserPage
                clickHostParty={this.clickHostParty}
                clickJoinParty={this.clickJoinParty}
                videos={videos}
                searchHandler={this.searchHandler}
                listClickHandler={this.listClickHandler}
                userPlaylist={userPlaylist} 
                handleFormChange={this.handleFormChange}
                accessCode={accessCode}
                currentUser={currentUser}
                deleteSong={this.deleteSong}
                userCell={userCell}
                invitees={invitees}
                grabInvitees={this.grabInvitees}
              />
          </Col>
        </Row>
        </Container>
      );
    }
  }
}

export default App;
