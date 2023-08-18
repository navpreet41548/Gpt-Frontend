import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react"
import CallList from './pages/callList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import callDetails from './pages/callDetails';
import CallDetails from './pages/callDetails';


function App() {

  return (
    <Router>
    
      <Routes>
        <Route path="/" exact element={<CallList/>} />
        <Route path="/calls/:callId" element={<CallDetails/>} />
      </Routes>
    
  </Router>
//     <div className="App">
// <CallList/>
//     </div>
  );
}

export default App;
