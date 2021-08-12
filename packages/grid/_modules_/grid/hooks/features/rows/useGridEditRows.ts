import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_EDIT_CELL_PROPS_CHANGE,
  GRID_CELL_EDIT_COMMIT,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_EDIT_START,
  GRID_CELL_EDIT_STOP,
  GRID_CELL_NAVIGATION_KEY_DOWN,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_KEY_DOWN,
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_CELL_FOCUS_OUT,
  GRID_EDIT_ROWS_MODEL_CHANGE,
} from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridCellEditCommitParams,
  GridCommitCellChangeParams,
} from '../../../models/params/gridEditCellParams';
import {
  isPrintableKey,
  isCellEditCommitKeys,
  isCellEnterEditModeKeys,
  isCellExitEditModeKeys,
  isDeleteKeys,
  isKeyboardEvent,
} from '../../../utils/keyboardUtils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useEventCallback } from '../../../utils/material-ui-utils';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'editRowsModel' | 'onEditRowsModelChange'>,
) {
  const logger = useLogger('useGridEditRows');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);

  const commitPropsAndExit = (params: GridCellParams, event: MouseEvent | React.SyntheticEvent) => {
    if (params.cellMode === 'view') {
      return;
    }
    apiRef.current.commitCellChange(params, event);
    apiRef.current.publishEvent(GRID_CELL_EDIT_STOP, params, event);
  };

  const handleCellFocusOut = useEventCallback(
    (params: GridCellParams, event: MouseEvent | React.SyntheticEvent) => {
      commitPropsAndExit(params, event);
    },
  );

  const handleColumnHeaderDragStart = useEventCallback((nativeEvent) => {
    const { cell } = apiRef.current.getState().focus;
    if (!cell) {
      return;
    }
    const params = apiRef.current.getCellParams(cell.id, cell.field);
    commitPropsAndExit(params, nativeEvent);
  });

  const setCellMode = React.useCallback(
    (id, field, mode: GridCellMode) => {
      const isInEditMode = apiRef.current.getCellMode(id, field) === 'edit';
      if ((mode === 'edit' && isInEditMode) || (mode === 'view' && !isInEditMode)) {
        return;
      }

      logger.debug(`Switching cell id: ${id} field: ${field} to mode: ${mode}`);
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        newEditRowsState[id] = { ...newEditRowsState[id] };
        if (mode === 'edit') {
          newEditRowsState[id][field] = { value: apiRef.current.getCellValue(id, field) };
        } else {
          delete newEditRowsState[id][field];
          if (!Object.keys(newEditRowsState[id]).length) {
            delete newEditRowsState[id];
          }
        }
        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode,
        api: apiRef.current,
      });
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const getCellMode = React.useCallback(
    (id, field) => {
      const editState = apiRef.current.getState().editRows;
      const isEditing = editState[id] && editState[id][field];
      return isEditing ? 'edit' : 'view';
    },
    [apiRef],
  );

  const isCellEditable = React.useCallback(
    (params: GridCellParams) =>
      params.colDef.editable &&
      params.colDef!.renderEditCell &&
      (!options.isCellEditable || options.isCellEditable(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.isCellEditable],
  );

  const setEditCellValue = React.useCallback(
    (params: GridEditCellValueParams, event?: React.SyntheticEvent) => {
      const newParams: GridEditCellPropsParams = {
        id: params.id,
        field: params.field,
        props: { value: params.value },
      };
      apiRef.current.publishEvent(GRID_EDIT_CELL_PROPS_CHANGE, newParams, event);
    },
    [apiRef],
  );

  const setEditCellProps = React.useCallback(
    (params: GridEditCellPropsParams) => {
      const { id, field, props: editProps } = params;
      logger.debug(`Setting cell props on id: ${id} field: ${field}`);
      setGridState((state) => {
        const column = apiRef.current.getColumn(field);
        const parsedValue = column.valueParser
          ? column.valueParser(editProps.value, apiRef.current.getCellParams(id, field))
          : editProps.value;

        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = { ...state.editRows[id] };
        editRowsModel[id][field] = { ...editProps, value: parsedValue };
        return { ...state, editRows: editRowsModel };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const handleEditCellPropsChange = React.useCallback(
    (params: GridEditCellPropsParams) => {
      setEditCellProps(params);
    },
    [setEditCellProps],
  );

  const setEditRowsModel = React.useCallback(
    (editRows: GridEditRowsModel): void => {
      logger.debug(`Setting row model`);

      setGridState((state) => ({ ...state, editRows }));
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const getEditRowsModel = React.useCallback(
    (): GridEditRowsModel => apiRef.current.getState().editRows,
    [apiRef],
  );

  const commitCellChange = React.useCallback(
    (params: GridCommitCellChangeParams, event?: MouseEvent | React.SyntheticEvent): boolean => {
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        throw new Error(`Cell at id: ${id} and field: ${field} is not in edit mode`);
      }

      const { error, value } = model[id][field];
      if (!error) {
        const commitParams: GridCellEditCommitParams = { ...params, value };
        apiRef.current.publishEvent(GRID_CELL_EDIT_COMMIT, commitParams, event);
        return true;
      }
      return false;
    },
    [apiRef],
  );

  const handleCellEditCommit = React.useCallback(
    (params: GridCommitCellChangeParams) => {
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      const { value } = model[id][field];
      logger.debug(`Setting cell id: ${id} field: ${field} to value: ${value?.toString()}`);
      const row = apiRef.current.getRow(id);
      const rowUpdate = { ...row, [field]: value };
      apiRef.current.updateRows([rowUpdate]);
    },
    [apiRef, logger],
  );

  const handleCellEditEnter = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent | React.KeyboardEvent) => {
      if (!params.isEditable) {
        return;
      }

      setCellMode(params.id, params.field, 'edit');

      if (isKeyboardEvent(event) && isPrintableKey(event.key)) {
        setEditCellProps({
          id: params.id,
          field: params.field,
          props: { value: '' },
        });
      }
    },
    [setEditCellProps, setCellMode],
  );

  const preventTextSelection = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      const isMoreThanOneClick = event.detail > 1;
      if (params.isEditable && params.cellMode === 'view' && isMoreThanOneClick) {
        // If we click more than one time, then we prevent the default behavior of selecting the text cell.
        event.preventDefault();
      }
    },
    [],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event) => {
      const { id, field, cellMode, isEditable } = params;
      if (!isEditable) {
        return;
      }

      const isEditMode = cellMode === 'edit';

      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (!isEditMode && isCellEnterEditModeKeys(event.key) && !isModifierKeyPressed) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_START, params, event);
      }
      if (!isEditMode && isDeleteKeys(event.key)) {
        apiRef.current.setEditCellValue({ id, field, value: '' });
        apiRef.current.commitCellChange({ id, field }, event);
        apiRef.current.publishEvent(GRID_CELL_EDIT_STOP, params, event);
      }
      if (isEditMode && isCellEditCommitKeys(event.key)) {
        const commitParams = { id, field };
        if (!apiRef.current.commitCellChange(commitParams, event)) {
          return;
        }
      }
      if (isEditMode && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_STOP, params, event);
      }
    },
    [apiRef],
  );

  const handleCellEditExit = React.useCallback(
    (params: GridCellParams, event?: React.SyntheticEvent) => {
      setCellMode(params.id, params.field, 'view');

      // When dispatched by the document, the event is not passed
      if (!event || !isKeyboardEvent(event)) {
        return;
      }

      if (isCellEditCommitKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEY_DOWN, params, event);
        return;
      }
      if (event.key === 'Escape' || isDeleteKeys(event.key)) {
        apiRef.current.setCellFocus(params.id, params.field);
      }
    },
    [apiRef, setCellMode],
  );

  const handleCellDoubleClick = React.useCallback(
    (params: GridCellParams, event: React.SyntheticEvent) => {
      if (!params.isEditable) {
        return;
      }
      apiRef.current.publishEvent(GRID_CELL_EDIT_START, params, event);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_KEY_DOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_MOUSE_DOWN, preventTextSelection);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleCellDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS_OUT, handleCellFocusOut);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_START, handleColumnHeaderDragStart);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_START, handleCellEditEnter);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_STOP, handleCellEditExit);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_COMMIT, handleCellEditCommit);
  useGridApiEventHandler(apiRef, GRID_EDIT_CELL_PROPS_CHANGE, handleEditCellPropsChange);

  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_COMMIT, options.onCellEditCommit);
  useGridApiOptionHandler(apiRef, GRID_EDIT_CELL_PROPS_CHANGE, options.onEditCellPropsChange);
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_START, options.onCellEditStart);
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_STOP, options.onCellEditStop);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      setCellMode,
      getCellMode,
      isCellEditable,
      commitCellChange,
      setEditRowsModel,
      getEditRowsModel,
      setEditCellValue,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);

  React.useEffect(() => {
    apiRef.current.updateControlState<GridEditRowsModel>({
      stateId: 'editRows',
      propModel: props.editRowsModel,
      propOnChange: props.onEditRowsModelChange,
      stateSelector: (state) => state.editRows,
      changeEvent: GRID_EDIT_ROWS_MODEL_CHANGE,
    });
  }, [apiRef, props.editRowsModel, props.onEditRowsModelChange]);
}
