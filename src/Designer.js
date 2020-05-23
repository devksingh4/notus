import React from 'react';
import Dimensions from 'react-dimensions'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import MyCatalog from './catalog/mycatalog';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'

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

class MyPlanner extends React.Component {

  render() {
    return (

      <ReactPlanner
        width={this.props.containerWidth}
        height={this.props.containerHeight}
        catalog={MyCatalog}
        plugins={plugins}
        stateExtractor={state => state.get('react-planner-electron')}
      />

    )
  }
}

const EnhancedPlanner = Dimensions({ elementResize: true, className: 'react-dimensions-wrapper', containerStyle: { height: '95vh', padding: 0, border: 0, margin: 0}})(MyPlanner)

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
      <div style={{ height: '5vh', padding: '1vh', fontSize: '2vh', border: 0, margin: 0, backgroundColor: "#005faf", color: "#ffffff"}}>
        <p>Room Designer</p>
      </div>
      <Provider store={store}>
        <EnhancedPlanner />
      </Provider>
    </div>
  );
}



export default Designer;
