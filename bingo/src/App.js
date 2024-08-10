import React, { Component } from 'react'
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
  }
  render(){
    return (
      <div className='App'>
        <Router>
          <Routes>
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
