import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApi } from './useGridApi';
import { useGridState } from './useGridState';

export const useGridReducer = <State, Action>(
  apiRef: GridApiRef,
  stateId,
  reducer: React.Reducer<State, Action>,
  initialState: State,
) => {
  const gridApi = useGridApi(apiRef);
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const gridDispatch = React.useCallback(
    (action: Action) => {
      if (gridState[stateId] === undefined) {
        gridState[stateId] = initialState;
      }
      setGridState((state) => {
        const newState = { ...state };
        newState[stateId] = reducer(state[stateId], action);
        return newState;
      });
      forceUpdate();
    },
    [forceUpdate, gridState, initialState, reducer, setGridState, stateId],
  );

  const dispatchRef = React.useRef(gridDispatch);

  React.useEffect(() => {
    dispatchRef.current = gridDispatch;
  }, [gridDispatch]);

  const dispatch = React.useCallback((args) => dispatchRef.current(args), []);

  return { gridState, dispatch, gridApi };
};
