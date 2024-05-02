import './App.css';
import Feed from './pages/Feed.tsx';
import React, { useEffect } from 'react';
import CreateFeed from './pages/CreateFeed.tsx';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';

function App() {
  const [user, setUser] = React.useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      console.log("No user found")
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <div className="app">
        <Routes>
          <Route path="/:slug" element={<Feed user={user} />} />
          <Route path="/" element={<CreateFeed user={user} />} />
          <Route path="/den-feeden-fins-ikke" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
