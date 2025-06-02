// src/App.js
import React from 'react';
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import IntroPage from './components/IntroPage.jsx';
import FindEmptyClassPage from './components/FindEmptyClassPage.jsx';
import ViewClassSchedulePage from "./components/ViewClassSchedulePage.jsx";
import MySchedulePage from "./components/MySchedulePage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate replace to="/MySchedulePage"/>} />
          <Route path="/FindEmptyClassPage" element={<FindEmptyClassPage />} />
          <Route path="/ViewClassSchedulePage" element={<ViewClassSchedulePage />} />
          <Route path="/ViewClassSchedulePage/:classroomName" element={<ViewClassSchedulePage />} />
          <Route path="/MySchedulePage" element={<MySchedulePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;