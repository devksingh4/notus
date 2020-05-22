import {Catalog} from 'react-planner-electron';

import * as Areas from './areas/area/planner-element.jsx';
import * as Lines from './lines/wall/planner-element.jsx';
import * as Door from './holes/door/planner-element.jsx';
import * as DoorDouble from './holes/door-double/planner-element.jsx';
import * as Wind from './holes/window/planner-element.jsx';
import * as AirIn from './items/radiator-modern-style/planner-element.jsx';
import * as AirOut from './items/radiator-old-style/planner-element.jsx';
import * as OfficeDesk from './items/deskdouble/planner-element.jsx';
import * as ConfrenceTable from './items/canteen-table/planner-element.jsx';

let catalog = new Catalog();
for( let x in Areas ) catalog.registerElement( Areas[x] );
for( let x in Lines ) catalog.registerElement( Lines[x] );
for( let x in Door ) catalog.registerElement( Door[x] );
for( let x in DoorDouble ) catalog.registerElement( DoorDouble[x] );
for( let x in Wind ) { catalog.registerElement( Wind[x] ); };
// for( let x in AirCond ) { catalog.registerElement( AirCond[x] ); };
for( let x in AirIn ) { catalog.registerElement( AirIn[x] ); };
for( let x in AirOut ) { catalog.registerElement( AirOut[x] ); };
for( let x in OfficeDesk ) { catalog.registerElement( OfficeDesk[x] ); };
for( let x in ConfrenceTable ) { catalog.registerElement( ConfrenceTable[x] ); };

export default catalog;