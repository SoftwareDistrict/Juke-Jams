import React, { Component } from 'react';
import { postCell } from './axiosRequests'
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
        <button onClick={()=> {
          postCell({ id: currentId, cell: this.state.cell })
          .then(result => console.log('result: ', result))
          }}>Submit</button>
      </div>
    );
  };
};

export default Cell;
