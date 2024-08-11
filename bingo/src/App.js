import React, { Component } from 'react'
import './App.css';
import Home from './components/Home';
import BingoPage from './components/BingoPage';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      token:"",
      my_turn:"",
      navigator:"",
      click_enable:false
    }
    this.setState = this.setState.bind(this);
  }
  render(){
    return (
      <div className='App'>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home generateTokenState={this.setState}/>} />
            <Route path="/BingoPage" element={<BingoPage  click_enable = {this.state.click_enable} my_turn = {this.state.my_turn} token={this.state.token} navigator={this.state.navigator} handleApp = {this.setState}/>} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
