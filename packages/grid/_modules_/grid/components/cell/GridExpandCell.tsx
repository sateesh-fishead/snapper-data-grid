import * as React from 'react';
import { GRID_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';

export interface GridExpandCellProps {
  width?: number;
  height?: number;
    children: React.ReactNode;
}

export const GridExpandCell = React.memo(function GridExpandCell({
  width,
  height,
  children
}: GridExpandCellProps) {
  return (
    <div
      style={{
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
      }}
      className={GRID_CELL_CSS_CLASS}

    >{children}</div>
  );
});
