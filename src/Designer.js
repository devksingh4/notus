import React from 'react';
import Dimensions from 'react-dimensions'
import MyCatalog from './catalog/mycatalog';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import './index.css'
import { ScreenHeader } from './Header'
import ListGroup from 'react-bootstrap/ListGroup'

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
  constructor(props) {
    super(props);
    this.state= {loaderActive: false, vizActive: false}
  }

  componentDidMount() {
    eventEmitter.on("startloader", () => {
      this.setState({
        loaderActive: true,
      })
    });
    eventEmitter.on("stoploader", (metrics) => {
      this.setState({
        loaderActive: false,
      })
      eventEmitter.emit("startviz")
    });
    eventEmitter.on("probInfect", (metrics) => {
      if (!metrics.success) {
        this.setState({
          loaderActive: false,
          vizActive: false,
        })
      } else {
        this.setState({simData: metrics.data})
        eventEmitter.emit("stoploader");
      }
    });
    eventEmitter.on("startviz", () => {
      this.setState({
        vizActive: true,
      })
    });
    eventEmitter.on("stopviz", () => {
      this.setState({
        vizActive: false,
      })
    });
  }

  closeViz() {
    eventEmitter.emit("stopviz")
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
        {this.state.loaderActive ? <div className="loader"><div><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><p className="loaderText">Modeling</p></div></div> : null}
        {this.state.vizActive ? <div className="vizview">
          <Card className="vizcard">
            <Card.Header as="h3">Results</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>Employee Probability of Infection: {this.state.simData.prob}</ListGroup.Item>
                <ListGroup.Item>Some other data here...</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Button onClick={this.closeViz} style={{backgroundColor: "#005faf", border: 0}}>Close</Button>
          </Card>
        </div> : null}
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

ipcRenderer.on('probInfect', (event, metrics) => {
  eventEmitter.emit("probInfect", metrics)
})

ipcRenderer.on('startloadscreen', (event) => {
  eventEmitter.emit("startloader")
})

export default Designer;
