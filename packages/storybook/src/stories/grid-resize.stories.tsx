import * as React from 'react';
import { ElementSize, XGrid } from '@material-ui/x-grid';
import '../style/grid-stories.css';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Resize',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const ResizeSmallDataset = () => {
  const [size, setSize] = React.useState<ElementSize>({ width: 800, height: 600 });
  const data = useData(5, 4);

  return (
    <React.Fragment>
      <div>
        <button
          type="button"
          onClick={() => setSize((p: ElementSize) => ({ width: p.height, height: p.width }))}
          style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
        >
          Switch sizes
        </button>
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <XGrid rows={data.rows} columns={data.columns} />
      </div>
    </React.Fragment>
  );
};
export const ResizeLargeDataset = () => {
  const [size, setSize] = React.useState<ElementSize>({ width: 800, height: 600 });
  const data = useData(200, 200);

  return (
    <React.Fragment>
      <div>
        <button
          type="button"
          onClick={() => setSize((p: ElementSize) => ({ width: p.height, height: p.width }))}
          style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
        >
          Switch sizes
        </button>
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <XGrid rows={data.rows} columns={data.columns} />
      </div>
    </React.Fragment>
  );
};
