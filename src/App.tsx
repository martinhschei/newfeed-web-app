import './App.css';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateFeed from './pages/CreateFeed.tsx';
import Feed from './pages/Feed.tsx';

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path="/:slug" element={<Feed />} />
        <Route path="/" element={<CreateFeed />} />
      </Routes>
    </div>
  );
}

export default App;
