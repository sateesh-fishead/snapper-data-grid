import * as React from 'react';
import { GRID_ROW_CLICK, GRID_SELECTION_CHANGE, GRID_COLLAPSE_CHANGE } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSelectionApi } from '../../../models/api/gridSelectionApi';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import {
  gridSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridSelectionSelector';

export const useGridSelection = (apiRef: GridApiRef, props: GridComponentProps): void => {
  const logger = useLogger('useGridSelection');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);

  const propSelectionModel = React.useMemo(() => {
    if (props.selectionModel == null) {
      return props.selectionModel;
    }

    if (Array.isArray(props.selectionModel)) {
      return props.selectionModel;
    }

    return [props.selectionModel];
  }, [props.selectionModel]);

  const { checkboxSelection, disableMultipleSelection, disableSelectionOnClick, isRowSelectable } =
    options;

  const getSelectedRows = React.useCallback(
    () => selectedGridRowsSelector(apiRef.current.getState()),
    [apiRef],
  );

  interface RowModelParams {
    id: GridRowId;
    row: GridRowModel;
    allowMultipleOverride?: boolean;
    isSelected?: boolean;
    isMultipleKey?: boolean;
  }

    interface RowCollapseModelParams {
        id: GridRowId;
        row: GridRowModel;
        isSelected?: boolean;
    }

  const selectRowModel = React.useCallback(
    (rowModelParams: RowModelParams) => {
      const { id, allowMultipleOverride, isSelected, isMultipleKey } = rowModelParams;

      if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
        return;
      }

      logger.debug(`Selecting row ${id}`);

      setGridState((state) => {
        let selectionLookup = selectedIdsLookupSelector(state);
        const allowMultiSelect =
          allowMultipleOverride ||
          (!disableMultipleSelection && isMultipleKey) ||
          checkboxSelection;

        if (allowMultiSelect) {
          const isRowSelected = isSelected == null ? selectionLookup[id] === undefined : isSelected;
          if (isRowSelected) {
            selectionLookup[id] = id;
          } else {
            delete selectionLookup[id];
          }
        } else {
          const isRowSelected =
            isSelected == null ? !isMultipleKey || selectionLookup[id] === undefined : isSelected;
          selectionLookup = {};
          if (isRowSelected) {
            selectionLookup[id] = id;
          }
        }
        return { ...state, selection: Object.values(selectionLookup) };
      });
      forceUpdate();
    },
    [
      isRowSelectable,
      disableMultipleSelection,
      apiRef,
      logger,
      checkboxSelection,
      forceUpdate,
      setGridState,
    ],
  );

    const selectedCollapseRowModel = React.useCallback(
        (rowModelParams: RowCollapseModelParams) => {
            const { id, isSelected } = rowModelParams;

            if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
                return;
            }

            logger.debug(`Selecting row ${id}`);

            setGridState((state) => {
                let selectionLookup = selectedIdsLookupSelector(state);



                const isRowSelected =
                    isSelected == null ? selectionLookup[id] === undefined : isSelected;
                selectionLookup = {};
                if (isRowSelected) {
                    selectionLookup[id] = id;
                }

                return { ...state, selection: Object.values(selectionLookup) };
            });
            forceUpdate();
        },
        [
            isRowSelectable,
            apiRef,
            logger,
            forceUpdate,
            setGridState,
        ],
    );

  const selectRow = React.useCallback(
    (id: GridRowId, isSelected = true, allowMultiple = false) => {
      const row = apiRef.current.getRow(id);

      if (!row) {
        return;
      }

      selectRowModel({
        id,
        row,
        allowMultipleOverride: allowMultiple,
        isSelected,
      });
    },
    [apiRef, selectRowModel],
  );
  const selectedCollapseRow = React.useCallback(
    (id: GridRowId, isSelected = true) => {
      const row = apiRef.current.getRow(id);

      if (!row) {
        return;
      }

      selectedCollapseRowModel({
        id,
        row,
        isSelected,
      });
    },
    [apiRef, selectedCollapseRowModel],
  );

  const selectRows = React.useCallback(
    (ids: GridRowId[], isSelected = true, deSelectOthers = false) => {
      const selectableIds = isRowSelectable
        ? ids.filter((id) => isRowSelectable!(apiRef.current.getRowParams(id)))
        : ids;

      if (disableMultipleSelection && selectableIds.length > 1 && !checkboxSelection) {
        return;
      }

      setGridState((state) => {
        const selectionLookup = deSelectOthers ? {} : selectedIdsLookupSelector(state);
        selectableIds.forEach((id) => {
          if (isSelected) {
            selectionLookup[id] = id;
          } else if (selectionLookup[id] !== undefined) {
            delete selectionLookup[id];
          }
        });
        return { ...state, selection: Object.values(selectionLookup) };
      });

      forceUpdate();
    },
    [
      isRowSelectable,
      disableMultipleSelection,
      checkboxSelection,
      setGridState,
      forceUpdate,
      apiRef,
    ],
  );

  const setSelectionModel = React.useCallback<GridSelectionApi['setSelectionModel']>(
    (model) => {
      const currentModel = apiRef.current.getState().selection;
      if (currentModel !== model) {
        setGridState((state) => ({ ...state, selection: model }));
      }
    },
    [setGridState, apiRef],
  );

  const handleRowClick = React.useCallback(
    (params: GridRowParams, event: React.MouseEvent) => {
      if (!disableSelectionOnClick) {
        selectRowModel({
          id: params.id,
          row: params.row,
          isMultipleKey: event.metaKey || event.ctrlKey,
        });
      }
    },
    [disableSelectionOnClick, selectRowModel],
  );

  useGridApiEventHandler(apiRef, GRID_ROW_CLICK, handleRowClick);

  // TODO handle Cell Click/range selection?
  const selectionApi: GridSelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    setSelectionModel,
  };
  useGridApiMethod(apiRef, selectionApi, 'GridSelectionApi');

  React.useEffect(() => {
    apiRef.current.updateControlState<GridRowId[]>({
      stateId: 'selection',
      propModel: propSelectionModel,
      propOnChange: props.onSelectionModelChange,
      stateSelector: gridSelectionStateSelector,
      changeEvent: GRID_SELECTION_CHANGE,
    });
  }, [apiRef, props.onSelectionModelChange, propSelectionModel]);

    React.useEffect(() => {
        console.log('hai');

        //   apiRef.current.updateControlState<GridRowId[]>({
        //       stateId: 'selection',
        //       propOnClick: props.onCollapseModelChange,
        //       stateSelector: gridSelectionStateSelector,
        //       changeEvent: GRID_COLLAPSE_CHANGE,
        // });
    }, [apiRef, props.onCollapseModelChange, propSelectionModel]);



  React.useEffect(() => {
    // Rows changed
    setGridState((state) => {
      const newSelectionState = gridSelectionStateSelector(state);
      const selectionLookup = selectedIdsLookupSelector(state);
      let hasChanged = false;
      newSelectionState.forEach((id: GridRowId) => {
        if (!rowsLookup[id]) {
          delete selectionLookup[id];
          hasChanged = true;
        }
      });
      if (hasChanged) {
        return { ...state, selection: Object.values(selectionLookup) };
      }
      return state;
    });
    forceUpdate();
  }, [rowsLookup, apiRef, setGridState, forceUpdate]);

  React.useEffect(() => {
    if (propSelectionModel === undefined) {
      return;
    }

    apiRef.current.setSelectionModel(propSelectionModel);
  }, [apiRef, propSelectionModel, setGridState]);

  React.useEffect(() => {
    // isRowSelectable changed
    setGridState((state) => {
      const newSelectionState = [...state.selection];
      const selectionLookup = selectedIdsLookupSelector(state);
      let hasChanged = false;
      newSelectionState.forEach((id: GridRowId) => {
        const isSelectable = !isRowSelectable || isRowSelectable(apiRef.current.getRowParams(id));
        if (!isSelectable) {
          delete selectionLookup[id];
          hasChanged = true;
        }
      });
      if (hasChanged) {
        return { ...state, selection: Object.values(selectionLookup) };
      }
      return state;
    });
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, isRowSelectable]);
};
