import React from 'react';
import Dimensions from 'react-dimensions'
import MyCatalog from './catalog/mycatalog';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import { ScreenHeader } from './Header'

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

const { ipcRenderer } = window.require('electron')
const events = require('events');
const eventEmitter = new events.EventEmitter();

class MyPlanner extends React.Component {
  state = {
    loaderActive: false
  }
  
  componentWillMount() {console.log("componentWillMount")}

  componentDidMount() {
    eventEmitter.on("startloader", () => {
      this.setState({
        loaderActive: true
      })
      console.log("starting..." + this.state.loaderActive)
    });
    eventEmitter.on("stoploader", () => {
      this.setState({
        loaderActive: false
      })
      console.log("stopping..." + this.state.loaderActive)
    });
    console.log("componentDidMount")
  }

  render() {
    return (
      <div>
        <ReactPlanner
          width={this.props.containerWidth}
          height={this.props.containerHeight}
          catalog={MyCatalog}
          plugins={plugins}
          stateExtractor={state => state.get('react-planner-electron')}
        />
        {this.state.loaderActive ? <div className="loader"></div> : null}
      </div>
    )
  }
}

const EnhancedPlanner = Dimensions({ elementResize: true, className: 'react-dimensions-wrapper', containerStyle: { height: '94vh', padding: 0, border: 0, margin: 0 } })(MyPlanner)

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
    <div className="Designer" style={{ overflow: 'hidden' }}>
      <ScreenHeader name="Room Designer"></ScreenHeader>
      <Provider store={store}>
        <EnhancedPlanner />
      </Provider>
    </div>
  );
}

ipcRenderer.on('probInfect', (event, probability) => {
  eventEmitter.emit("stoploader")
  //alert(probability)
})

ipcRenderer.on('startloadscreen', (event) => {
  eventEmitter.emit("startloader")
})

export default Designer;
