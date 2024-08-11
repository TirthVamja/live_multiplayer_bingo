import React, { Component } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get} from "firebase/database";
import './Grid.css';
import { FirebaseConfig } from '../config';
import CONFIG from '../config';

export default class Grid extends Component {

  constructor(props){
    super(props);
    // Initialize Firebase
    this.app = initializeApp(FirebaseConfig);
    this.database = getDatabase(this.app);
  }

  game_win = async () => {
    await fetch(`${CONFIG}/game_win?token=${this.props.token}&player=${this.props.my_turn}`)
      .then(async response => {
      })
      .catch(error => {console.log("Win response error");});
  }

  clickButton = async (event) => {
    if(!this.props.click_enable) return;
    this.props.handleGridState(()=>{return {click_enable:false}});
    const db = getDatabase(this.app);
    let whole_data = await get(ref(db,`${this.props.token}`));
    whole_data = whole_data.val();
    let num_player = whole_data["player"];
    let turn = whole_data["turn"];

    if(num_player.length<=1) return;

    if(turn!==this.props.my_turn){
      console.log("Not your turn");
      return;
    }
    
    let temp_grid_values = this.props.states.grid_values;
    let value = this.props.value;

    if(temp_grid_values[value][1]){
      this.props.handleGridState(()=>{return {click_enable:true}});
      return;
    }

    temp_grid_values[value][1] = true;
    
    await fetch(`${CONFIG}/button_clicked?button_number=${temp_grid_values[value][0]}&token=${this.props.token}`)
    .then(async response => {
      let res = await response.json();
      this.props.handleBingo({current_turn:res.next_turn});
    })
    .catch(error => {console.log("Button click contains error");});
    
    this.props.checkBingo(temp_grid_values);
    console.log("inside");
    this.props.handleGridState(() => {return {grid_values:temp_grid_values, click_enable:false}});    
  }

  render() {
    return (
        <div
          className='grid-div'
          style={this.props.states.grid_values[this.props.value][1]?{backgroundColor:"#0baff7", boxShadow: "2px 2px 2px 0px #0b97d5"}:{}}
          key={this.props.value}
          onClick={this.clickButton}
        >
          {this.props.states.grid_values[this.props.value][0]}
        </div>        
    )
  }
}
