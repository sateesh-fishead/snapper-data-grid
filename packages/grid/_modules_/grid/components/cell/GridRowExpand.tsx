import * as React from 'react';
import {GRID_ROW_CSS_CLASS} from '../../constants/cssClassesConstants';

export interface GridRowExpandProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const GridRowExpand = React.memo(function GridRowExpand({
  width,
  height,
  children
}: GridRowExpandProps) {
  return (
    <div
        className={GRID_ROW_CSS_CLASS}
    >{children}</div>
  );
});
