import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import MyCatalog from './catalog/mycatalog';
import {Map} from 'immutable';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';

// import {
//   Models as PlannerModels,
//   reducer as PlannerReducer,
//   ReactPlanner,
//   Plugins as PlannerPlugins,
// } from '/home/dsingh/source/react-planner';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner-electron';

//define state
let AppState = Map({
  'react-planner-electron': new PlannerModels.State()
});
 
//define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update('react-planner-electron', plannerState => PlannerReducer(plannerState, action));
  return state;
};
 
let store = createStore(reducer, null, window.devToolsExtension ? window.devToolsExtension() : f => f);
 
let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-planner-electron_v0'),
];
function Designer() {
  return (
    <div className="Designer">
      <Jumbotron fluid>
        <Container>
          <h1>Room Designer</h1>
          <p></p>
        </Container>
      </Jumbotron>
      <Provider store={store}>
      <Container className='overflow-hidden'>
      <ReactPlanner
        catalog={MyCatalog}
        width={1000}
        height={1000}
        plugins={plugins}
        stateExtractor={state => state.get('react-planner-electron')}
      />
      </Container>
    </Provider>
    <Jumbotron></Jumbotron>
    </div>
  );
}

export default Designer;
