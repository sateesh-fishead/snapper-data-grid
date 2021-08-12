import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { expect } from 'chai';
import { GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS, XGrid } from '@material-ui/x-grid';
import { getColumnHeaderCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Column Headers', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
    disableColumnResize: false,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        foundationYear: 1964,
      },
      {
        id: 1,
        brand: 'Adidas',
        foundationYear: 1949,
      },
      {
        id: 2,
        brand: 'Puma',
        foundationYear: 1948,
      },
    ],
  };

  describe('GridColumnHeaderMenu', () => {
    it('should close the menu of a column when resizing this column', async () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <XGrid
            {...baselineProps}
            columns={[
              { field: 'brand', resizable: true },
              { field: 'foundationYear', resizable: true },
            ]}
          />
        </div>,
      );

      const columnCell = getColumnHeaderCell(0);

      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');

      fireEvent.click(menuIconButton);
      await waitFor(() => expect(screen.queryByRole('menu')).not.to.equal(null));

      const separator = columnCell.querySelector('.MuiDataGrid-iconSeparator');
      fireEvent.mouseDown(separator);
      // TODO remove mouseUp once useGridColumnReorder will handle cleanup properly
      fireEvent.mouseUp(separator);
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));
    });

    it('should close the menu of a column when resizing another column', async () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <XGrid
            {...baselineProps}
            columns={[
              { field: 'brand', resizable: true },
              { field: 'foundationYear', resizable: true },
            ]}
          />
        </div>,
      );

      const columnWithMenuCell = getColumnHeaderCell(0);
      const columnToResizeCell = getColumnHeaderCell(1);

      const menuIconButton = columnWithMenuCell.querySelector('button[aria-label="Menu"]');

      fireEvent.click(menuIconButton);
      await waitFor(() => expect(screen.queryByRole('menu')).not.to.equal(null));

      const separator = columnToResizeCell.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator);
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));
    });
  });
});
