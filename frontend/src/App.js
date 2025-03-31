// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ClassroomSchedule from './components/ClassroomSchedule';
import { useEffect } from "react";
import IntroPage from './components/IntroPage.js';
import FindEmptyClassPage from './components/FindEmptyClassPage.js'
import ViewClassSchedulePage from "./components/ViewClassSchedulePage.js";
import MySchedulePage from "./components/MySchedulePage.js"


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/api-test" element={<ClassroomSchedule />} />
          <Route path="/FindEmptyClassPage" element={<FindEmptyClassPage />} />
          <Route path="/ViewClassSchedulePage" element={<ViewClassSchedulePage />} />
          <Route path="/MySchedulePage" element={<MySchedulePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;