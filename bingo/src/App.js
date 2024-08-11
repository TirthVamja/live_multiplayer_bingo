import React, { Component } from 'react'
import Home from './components/Home';
import './App.css';
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
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
