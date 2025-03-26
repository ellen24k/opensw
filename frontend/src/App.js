// src/App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ClassroomSchedule from './components/ClassroomSchedule';
import MainFrame from "./components/MainFrame.js";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainFrame/>}/>
                    <Route path="/api-test" element={<ClassroomSchedule/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;