import * as React from 'react';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export type GridOverlayProps = React.HTMLAttributes<HTMLDivElement>;

export const GridOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(function GridOverlay(
  props: GridOverlayProps,
  ref,
) {
  const { className, style, ...other } = props;
  const apiRef = useGridApiContext();
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

  return (
    <div
      ref={ref}
      className={clsx('MuiDataGrid-overlay', className)}
      style={{ top: headerHeight, ...style }}
      {...other}
    />
  );
});
