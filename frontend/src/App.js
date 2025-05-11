// src/App.js
import React from 'react';
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import ClassroomSchedule from './components/ClassroomSchedule';
import IntroPage from './components/IntroPage.js';
import FindEmptyClassPage from './components/FindEmptyClassPage.js';
import ViewClassSchedulePage from "./components/ViewClassSchedulePage.js";
import MySchedulePage from "./components/MySchedulePage.js";
import { SelectedOptionIdProvider } from './components/NaviContext.js';

function App() {
  return (
    <SelectedOptionIdProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/api-test" element={<ClassroomSchedule />} />
            <Route path="/FindEmptyClassPage" element={<FindEmptyClassPage />} />
            <Route path="/ViewClassSchedulePage" element={<ViewClassSchedulePage />} />
            <Route path="/ViewClassSchedulePage/:classroomName" element={<ViewClassSchedulePage />} />
            <Route path="/MySchedulePage" element={<MySchedulePage />} />
          </Routes>
        </div>
      </Router>
    </SelectedOptionIdProvider>
  );
}

export default App;