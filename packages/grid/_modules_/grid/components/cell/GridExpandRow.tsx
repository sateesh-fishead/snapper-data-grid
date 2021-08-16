import * as React from 'react';
import {GRID_CELL_CSS_CLASS} from '../../constants/cssClassesConstants';

export interface GridExpandRowProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const GridExpandRow = React.memo(function GridExpandRow({
  width,
  height,
  children
}: GridExpandRowProps) {
  return (
    <div
    >{children}</div>
  );
});
