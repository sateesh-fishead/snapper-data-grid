import * as React from 'react';
import { ElementSize, GridColDef, XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Reorder',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const ReorderSmallDataset = () => {
  const size: ElementSize = { width: 800, height: 600 };
  const data = useData(5, 4);

  return (
    <div style={{ width: size.width, height: size.height, display: 'flex' }}>
      <XGrid rows={data.rows} columns={data.columns} />
    </div>
  );
};

export const DisableReorderOnSomeColumn = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });
  const [columns, setColumns] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const newColumns: GridColDef[] = data.columns.map((col) =>
        col.field === 'quantity' ? { ...col, disableReorder: true } : col,
      );
      setColumns(newColumns);
    }
  }, [data.columns]);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={columns} checkboxSelection />
    </div>
  );
};
