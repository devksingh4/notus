import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route
} from "react-router-dom";

// Screens
import Home from './Home';
import Designer from './Designer';


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <div>
        <Route path="/" exact     component={ Home } />
        <Route path="/designer"     component={ Designer } />
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
