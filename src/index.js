import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route
} from "react-router-dom";

// Screens
import Home from './Home';
import Designer from './Designer';
import Configurator from './Configurator';
import Tutorial from './Tutorial';


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <div>
        <Route path="/" exact     component={ Home } />
        <Route path="/designer"     component={ Designer } />
        <Route path="/configurator"     component={ Configurator } />
        <Route path="/tutorial"     component={ Tutorial } />
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
