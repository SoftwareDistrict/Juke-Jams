import React, { Component } from 'react';
import { postCell } from './axiosRequests'
import { Container, Row, Col, Button, Jumbotron, OverlayTrigger, Popover } from 'react-bootstrap';
import UserPage from './userPage.js';
class Cell extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cell: null,
      cellComplete: false
    }
    this.changeHandler = this.changeHandler.bind(this)
  }


  


  changeHandler (event) {
      this.setState({
        cell: event.target.value
      })

      console.log(this.state.cell)
  }

  render() {
    console.log('currentid', this.props.currentId)
    const { currentId,
      clickHostParty,
      clickJoinParty,
      videos,
      searchHandler,
      listClickHandler,
      userPlaylist,
      handleFormChange,
      accessCode,
      currentUser,
      deleteSong,
      cellFilled
} = this.props;
    return (

      <div>
        {this.state.cellComplete ? (
          <Container style={{ display: "flex", justifyContent: 'center', border: "8px solid #cecece" }}>
          <Row style={{ padding: "5px" }}>
            <Col>
                <UserPage
                  clickHostParty={clickHostParty}
                  clickJoinParty={clickJoinParty}
                  videos={videos}
                  searchHandler={searchHandler}
                  listClickHandler={listClickHandler}
                  userPlaylist={userPlaylist}
                  handleFormChange={handleFormChange}
                  accessCode={accessCode}
                  currentUser={currentUser}
                  deleteSong={deleteSong}
                />
            </Col>
          </Row>
          </Container>
        ) : (
          
          <div>
            <label className='CellNumber'for="phone">Enter your cell number:</label>
              <input type="tel" id="phone" onChange={this.changeHandler} name="phone" />
               <small>Format: 5044567890</small><br/>
            <button onClick={()=>{
              console.log('button was clicked on');
              postCell({id: this.props.currentId, cell: this.state.cell}).then((result)=>{
              console.log(result)})
              this.setState({
                cellComplete: true
              })  
            }}>Submit</button>
          </div>

)}
</div>



  
      
        );


  }
}

export default Cell;



