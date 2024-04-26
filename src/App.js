import React from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom';
import MapPage from './pages/map-page';
import ReviewPage from './pages/review-page';
import ReviewWritePage from './pages/reviewWrite-page';
import './styles/app-style.css';

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <div className="main_box">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route
              path="/review"
              element={<ReviewPage />}
            />
            <Route
              path="/review-write"
              element={<ReviewWritePage />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;
