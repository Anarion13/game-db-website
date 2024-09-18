import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import SearchResults from './components/SearchResults';
import Login from './components/Login';
import Backlog from './components/Backlog';
import InProgress from './components/InProgress';
import Finished from './components/Finished';
import './App.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Header />
            <SearchBar />
            <Routes>
              <Route path="/" element={<GameList />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/backlog" element={<Backlog />} />
              <Route path="/in-progress" element={<InProgress />} />
              <Route path="/finished" element={<Finished />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
