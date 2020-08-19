import React, { Component } from 'react';

class Cell extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cell: null
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
    return (
          <div>
            <label className='CellNumber'for="phone">Enter your cell number:</label>
              <input type="tel" id="phone" onChange={this.changeHandler} name="phone"
             pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
             required />
            <small>Format: 123-456-7890</small>
          </div>
      
        );
  }
}

export default Cell;



// import React from 'react';

// const Cell = ({cell}) => {
//   return (
//     <div>
//       <label className='CellNumber'for="phone">Enter your cell number:</label>
//         <input type="tel" id="phone" onChange={(event) => event.target.value} name="phone"
//        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
//        required />
//       <small>Format: 123-456-7890</small>
//     </div>

//   );
// };

// export default Cell;