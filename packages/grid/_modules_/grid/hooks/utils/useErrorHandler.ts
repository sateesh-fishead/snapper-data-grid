import * as React from 'react';
import { GRID_COMPONENT_ERROR } from '../../constants';
import { GridApiRef } from '../../models/api';
import { useGridState } from '../features/core/useGridState';
import { useGridApiEventHandler } from '../root/useGridApiEventHandler';

export function useErrorHandler(apiRef: GridApiRef, props) {
  const [, setGridState] = useGridState(apiRef);

  const handleError = React.useCallback(
    (args: any) => {
      // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
      setGridState((state) => ({ ...state, error: args }));
    },
    [setGridState],
  );

  React.useEffect(() => {
    handleError(props.error);
  }, [handleError, props.error]);

  useGridApiEventHandler(apiRef, GRID_COMPONENT_ERROR, handleError);
}
