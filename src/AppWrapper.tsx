import React from 'react';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;