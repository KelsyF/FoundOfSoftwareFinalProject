import React from 'react';
import ReactDOM from 'react-dom/client'; // Update the import path to include /client
import './index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root container instance
root.render(<FakeStackOverflow />); // Use the root.render method
