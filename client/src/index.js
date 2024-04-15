import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { UserProvider } from './components/context/UserContext.js'; // Ensure the path is correct
import FakeStackOverflow from './components/fakestackoverflow.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <FakeStackOverflow />
    </UserProvider>
);
