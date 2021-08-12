import * as React from 'react';
import { GridColumns, XGrid } from '@material-ui/x-grid';

const columns: GridColumns = [
  { field: 'name', type: 'string' },
  { field: 'email', type: 'string' },
  { field: 'age', type: 'number' },
  { field: 'dateCreated', type: 'date', width: 180 },
  { field: 'lastLogin', type: 'dateTime', width: 180 },
];

function loadServerRows(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Error loading rows.'));
    }, 800);
  });
}

export default function ServerErrorStateDemo() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>();

  React.useEffect(() => {
    setLoading(true);
    loadServerRows().catch((serverError) => {
      setLoading(false);
      setError({ message: `An error occured! Details: ${serverError.message}` });
    });
  }, []);

  return <XGrid rows={[]} columns={columns} autoHeight error={error} loading={loading} />;
}
