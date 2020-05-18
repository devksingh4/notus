import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import MyCatalog from './catalog/mycatalog';
import {Map} from 'immutable';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner';

//define state
let AppState = Map({
  'react-planner': new PlannerModels.State()
});
 
//define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
  return state;
};
 
let store = createStore(reducer, null, window.devToolsExtension ? window.devToolsExtension() : f => f);
 
let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-planner_v0'),
  PlannerPlugins.ConsoleDebugger(),
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
      <Container>
      <ReactPlanner
        catalog={MyCatalog}
        width={1000}
        height={1000}
        plugins={plugins}
        stateExtractor={state => state.get('react-planner')}
      />
      </Container>
    </Provider>
    </div>
  );
}

export default Designer;
