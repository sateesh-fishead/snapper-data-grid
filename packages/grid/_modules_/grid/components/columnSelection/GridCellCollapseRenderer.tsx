import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { GRID_CELL_NAVIGATION_KEY_DOWN } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridCellCollapseForwardRef = React.forwardRef<HTMLButtonElement, GridCellParams>(
  function GridCellCollapseRenderer(props, ref) {
    const { field, id, value, tabIndex, hasFocus } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const buttonElement = React.useRef<HTMLButtonElement | null>(null);

    const handleRef = useForkRef(buttonElement, ref);
    const element = props.api.getCellElement(id, field);

    const [isSelect, setIsSelect] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        //apiRef!.current.selectCollapseRow(id, !isSelect);
        setIsSelect(!isSelect);
    };

    React.useLayoutEffect(() => {
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [element, tabIndex]);



    const handleKeyDown = React.useCallback(
      (event) => {
        if (isSpaceKey(event.key)) {
          event.stopPropagation();
        }
        if (isNavigationKey(event.key) && !event.shiftKey) {
          apiRef!.current.publishEvent(GRID_CELL_NAVIGATION_KEY_DOWN, props, event);
        }
      },
      [apiRef, props],
    );

    const CollapseComponent = apiRef?.current.components.Collapse!;

    const isSelectable =
      !rootProps.isRowExpandable || rootProps.isRowExpandable(apiRef!.current.getRowParams(id));

    return (
      <CollapseComponent
        ref={handleRef}
        tabIndex={tabIndex}
        onClick={handleClick}
        className={`MuiDataGrid-checkboxInput ${isSelect ? 'expand' : 'collapse'}`}
        color="primary"
        inputProps={{ 'aria-label': 'Select Row' }}
        onKeyDown={handleKeyDown}
        disabled={!isSelectable}
        {...apiRef?.current.componentsProps?.collapse}
      >C</CollapseComponent>
    );
  },
);

export const GridCellCollapseRenderer = React.memo(GridCellCollapseForwardRef);
