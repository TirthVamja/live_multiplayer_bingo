import React, { Component } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue, update, get} from "firebase/database";
import Grid from './Grid';
import { FirebaseConfig } from '../config';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CONFIG from '../config';
import WINNER from '../media/winner.jpeg';
import GAME_OVER from '../media/game_over.webp';
import './Grids.css';


export default class Grids extends Component {
  constructor(props){
    super(props);
    // Initialize Firebase
    console.log("Constructor Grids");
    this.app = initializeApp(FirebaseConfig);
    this.database = getDatabase(this.app);

    let grid_values = {};
    let grid_array = [];
    for(let i=1;i<=25;i++)grid_array.push(i);
    grid_array = this.shuffleArray(grid_array);
    for(let i=1; i<=25; i++){
      grid_values[i] = [grid_array[i-1],false];
    }
    this.state={grid_values:grid_values,modal_open:false, game_win:false, click_enable:this.props.click_enable}
    this.setState = this.setState.bind(this);
    this.style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  }
  componentDidMount = () => {
    console.log("did mount");
    if(this.props.token){
      const db = getDatabase(this.app);
      const starCountRef = ref(db, this.props.token);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log("onValue");
        let grid_values = this.state.grid_values;
        for(let i=1;i<=25;i++){
          grid_values[i][1]=data[grid_values[i][0]];
        }
        this.checkBingo(grid_values);
        if(data["game_win"]===-1 || data["game_win"]===undefined){
          this.setState(() => {return {grid_values:grid_values, click_enable:true}});
          this.props.handleBingo({current_turn:data["turn"]});
        }
        else if(data["game_win"]===this.props.my_turn){
          console.log("You Win");
          this.setState({modal_open:true, game_win:true});
          this.props.handleBingo({current_turn:data["turn"]});
        }
        else{
          console.log("You loose");
          this.setState({modal_open:true, game_win:false});
          this.props.handleBingo({current_turn:data["turn"]});
        }
      });
    }
  }
  
  // Function to shuffle the array content
  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  
  handleClose = () => {
    this.setState({modal_open:false});
    this.props.navigator("/");
  }

  game_win = async () => {
    const db = getDatabase(this.app);
    let game_win_check = await get(ref(db,`${this.props.token}/game_win`));
    if(game_win_check.val()!==-1){console.log("returning");return;}
    await fetch(`${CONFIG}/game_win?token=${this.props.token}&player=${this.props.my_turn}`)
    .catch(error => {console.log("Win response error");});
  }

  checkBingo = (temp_grid_values) => {
    let bingo = ['B','I','N','G','O'];
    let bingo_dict = {'B':false,'I':false,'N':false,'G':false,'O':false}
    let bingoCount = 0;
    
    for(let i=0;i<5;i++){
      let check = 0;
      for(let j=0;j<5;j++){
        if(temp_grid_values[j*5+i+1][1])check++;
      }
      if(check===5){
        bingo_dict[bingo[bingoCount]]=true;
        bingoCount++;
      }
    }

    for(let i=0;i<5;i++){
      let check = 0;
      for(let j=0;j<5;j++){
        if(temp_grid_values[j+i*5+1][1])check++;
      }
      if(check===5){
        if(bingoCount<5){
          bingo_dict[bingo[bingoCount]]=true;
          bingoCount++;
        }
      }
    }

    let count = -5;
    let check = 0;
    for(let i=0;i<5;i++){
      count+=6;
      if(temp_grid_values[count][1])check++;
    }
    if(check===5){
      if(bingoCount<5){
        bingo_dict[bingo[bingoCount]]=true;
        bingoCount++;
      }
    }

    count = 1;
    check = 0;
    for(let i=0;i<5;i++){
      count+=4;
      if(temp_grid_values[count][1])check++;
    }
    if(check===5){
      if(bingoCount<5){
        bingo_dict[bingo[bingoCount]]=true;
        bingoCount++;
      }
    }
    if(bingoCount===5){
      this.game_win();
    }

    this.props.handleBingo(() =>{return {bingo:bingo_dict}});
  }

  render() {
    let grid = []; 
    for (let i = 1; i <= 25; i++) {
      grid.push(<Grid key={i} value={i} click_enable = {this.state.click_enable} my_turn={this.props.my_turn} checkBingo={this.checkBingo} token={this.props.token} states = {this.state} handleGridState = {this.setState}  handleBingo = {this.props.handleBingo} handleApp={this.props.handleApp}/>)  
    }
    return (
        <div className='grid-container'>
            {grid.map((grid_component) => grid_component)}
            <Modal
              open={this.state.modal_open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={this.style} className="game_win">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {this.state.game_win ? "Win" : "Loose"}
                </Typography>
                <img className = "small" style={{height: "10rem"}} src={this.state.game_win ? WINNER : GAME_OVER}></img>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {this.state.game_win ? "Congratulations..." : "Game Over..."}
                </Typography>
                <Button
                  onClick={this.handleClose}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                New Game
                </Button>
              </Box>
            </Modal>
      </div>
    )
  }
}
