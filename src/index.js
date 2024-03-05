import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import style from './resources/style.css';
import { MainVideoArea } from './components/mainVideo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <>
    <h3 class="heading">My Video Player</h3>
      <MainVideoArea />
  </>
  // </React.StrictMode>
);
reportWebVitals();
