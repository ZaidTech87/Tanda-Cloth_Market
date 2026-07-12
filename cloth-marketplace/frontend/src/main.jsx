// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css';
// import { RefreshProvider } from './context/RefreshContext';
//
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RefreshProvider } from './context/RefreshContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RefreshProvider>
      <App />
    </RefreshProvider>
  </React.StrictMode>
);