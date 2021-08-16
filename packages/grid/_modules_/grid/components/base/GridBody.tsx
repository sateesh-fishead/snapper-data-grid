import * as React from 'react';
import { GRID_RESIZE } from '../../constants/eventsConstants';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { ElementSize } from '../../models/elementSize';
import { GridColumnsHeader } from '../columnHeaders/GridColumnHeaders';
import { GridColumnsContainer } from '../containers/GridColumnsContainer';
import { GridMainContainer } from '../containers/GridMainContainer';
import { GridWindow } from '../containers/GridWindow';
import { GridAutoSizer } from '../GridAutoSizer';
import { GridViewport } from '../GridViewport';
import { GridOverlays } from './GridOverlays';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridBodyProps {
  children?: React.ReactNode;
}

export function GridBody(props: GridBodyProps) {
  const { children } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);
  const renderingZoneRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.columnHeadersContainerElementRef = columnsContainerRef;

  apiRef.current.columnHeadersElementRef = columnsHeaderRef;
  apiRef.current.windowRef = windowRef;
  apiRef.current.renderingZoneRef = renderingZoneRef;

  const handleResize = React.useCallback(
    (size: ElementSize) => apiRef.current.publishEvent(GRID_RESIZE, size),
    [apiRef],
  );

  return (
    <GridMainContainer>
      <GridOverlays />
      <GridColumnsContainer ref={columnsContainerRef}>
        <GridColumnsHeader ref={columnsHeaderRef} />
      </GridColumnsContainer>
      <GridAutoSizer
        nonce={rootProps.nonce}
        disableHeight={rootProps.autoHeight}
        onResize={handleResize}
      >
        {(size: any) => (
          <GridWindow ref={windowRef} size={size}>
            <GridViewport ref={renderingZoneRef} />
          </GridWindow>
        )}
      </GridAutoSizer>
      {children}
    </GridMainContainer>
  );
}
