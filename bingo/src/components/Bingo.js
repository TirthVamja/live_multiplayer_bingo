import React, { Component } from 'react'
import './Bingo.css';


export default class Bingo extends Component {
  constructor(props){
    super(props);
    console.log("constructor Bingo");
  }
  render() {
    let bingo_div = [];
    ['B','I','N','G','O'].map((ele) => {
      bingo_div.push(
        <div className='bingo-div' style={this.props.handleBingo.bingo[ele]?{backgroundColor:"#ffa861", boxShadow: "2px 2px 2px 0px #e29257"}:{}} key={ele}>{ele}</div>
      );
      return bingo_div;
    });
    return (
      <div className='bingo-container'>
        {bingo_div}
      </div>
    )
  }
}
