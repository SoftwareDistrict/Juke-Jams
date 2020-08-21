import React, { Component } from 'react';
import { postCell } from './axiosRequests'
import Button from 'react-bootstrap/Button';
class Cell extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cell: null,
    }
    this.changeHandler = this.changeHandler.bind(this)
  }

  changeHandler (event) {
      this.setState({
        cell: event.target.value
      });
  }

  render() {
    const { currentId } = this.props;
    // console.log('currentid', currentId);

    return (
      <div>
        <label className='CellNumber'>Enter your cell number:</label>
        <input type="tel" id="phone" onChange={this.changeHandler} name="phone" />
        <small>Format: 5044567890</small><br/>
        <Button onClick={()=> {
          postCell({ id: currentId, cell: this.state.cell })
          .then(result => console.log('result: ', result))
          }}>Submit</Button>
      </div>
    );
  };
};

export default Cell;
