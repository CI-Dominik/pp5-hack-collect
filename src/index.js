import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { BrowserRouter as Router } from 'react-router-dom'
import { ProfileDataProvider } from './contexts/ProfileDataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ProfileDataProvider>
        <CurrentUserProvider>
          <App />
        </CurrentUserProvider>
      </ProfileDataProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();