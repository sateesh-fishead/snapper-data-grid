/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import Alert from '@material-ui/lab/Alert';
import {
  GRID_CELL_EDIT_START,
  GRID_CELL_EDIT_STOP,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

export default function CatchEditingEventsGrid() {
  const apiRef = useGridApiRef();
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(GRID_CELL_EDIT_START, (params, event) => {
      setMessage(
        `Editing cell with value: ${params.value} and row id: ${params.id}, column: ${params.field}, triggered by ${event.type}.`,
      );
    });
  }, [apiRef]);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(GRID_CELL_EDIT_STOP, () => {
      setMessage('');
    });
  }, [apiRef]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 180, width: '100%' }}>
        <XGrid rows={rows} columns={columns} apiRef={apiRef} />
      </div>
      {message && (
        <Alert severity="info" style={{ marginTop: 8 }}>
          {message}
        </Alert>
      )}
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
