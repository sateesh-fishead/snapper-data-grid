import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { capitalize, unstable_useId as useId } from '@material-ui/core/utils';
import { makeStyles } from '@material-ui/styles';
import { filterableGridColumnsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridFilterOperator } from '../../../models/gridFilterOperator';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridCloseIcon } from '../../icons/index';
import { GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';

export interface GridFilterFormProps {
  item: GridFilterItem;
  hasMultipleFilters: boolean;
  showMultiFilterOperators?: boolean;
  multiFilterOperator?: GridLinkOperator;
  disableMultiFilterOperator?: boolean;
  applyFilterChanges: (item: GridFilterItem) => void;
  applyMultiFilterOperatorChanges: (operator: GridLinkOperator) => void;
  deleteFilter: (item: GridFilterItem) => void;
}

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: 8,
    },
    linkOperatorSelect: {
      minWidth: 60,
    },
    columnSelect: {
      width: 150,
    },
    operatorSelect: {
      width: 120,
    },
    filterValueInput: {
      width: 190,
    },
    closeIcon: {
      flexShrink: 0,
      justifyContent: 'flex-end',
      marginRight: 6,
      marginBottom: 2,
    },
  },
  { name: 'MuiGridFilterForm' },
);

export function GridFilterForm(props: GridFilterFormProps) {
  const {
    item,
    hasMultipleFilters,
    deleteFilter,
    applyFilterChanges,
    multiFilterOperator,
    showMultiFilterOperators,
    disableMultiFilterOperator,
    applyMultiFilterOperatorChanges,
  } = props;
  const classes = useStyles();
  const apiRef = useGridApiContext();
  const filterableColumns = useGridSelector(apiRef, filterableGridColumnsSelector);
  const linkOperatorSelectId = useId();
  const linkOperatorSelectLabelId = useId();
  const columnSelectId = useId();
  const columnSelectLabelId = useId();
  const operatorSelectId = useId();
  const operatorSelectLabelId = useId();
  const [currentColumn, setCurrentColumn] = React.useState<GridColDef | null>(() => {
    if (!item.columnField) {
      return null;
    }
    return apiRef!.current.getColumn(item.columnField)!;
  });
  const [currentOperator, setCurrentOperator] = React.useState<GridFilterOperator | null>(() => {
    if (!item.operatorValue || !currentColumn) {
      return null;
    }

    return (
      currentColumn.filterOperators?.find((operator) => operator.value === item.operatorValue) ||
      null
    );
  });

  const changeColumn = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const columnField = event.target.value as string;
      const column = apiRef!.current.getColumn(columnField)!;
      const newOperator = column.filterOperators![0];
      setCurrentOperator(newOperator);
      setCurrentColumn(column);

      applyFilterChanges({
        ...item,
        value: undefined,
        columnField,
        operatorValue: newOperator.value,
      });
    },
    [apiRef, applyFilterChanges, item],
  );

  const changeOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const operatorValue = event.target.value as string;
      applyFilterChanges({
        ...item,
        operatorValue,
      });
      const newOperator =
        currentColumn!.filterOperators?.find((operator) => operator.value === operatorValue) ||
        null;
      setCurrentOperator(newOperator);
    },
    [applyFilterChanges, currentColumn, item],
  );

  const changeLinkOperator = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const linkOperator =
        (event.target.value as string) === GridLinkOperator.And.toString()
          ? GridLinkOperator.And
          : GridLinkOperator.Or;
      applyMultiFilterOperatorChanges(linkOperator);
    },
    [applyMultiFilterOperatorChanges],
  );

  const handleDeleteFilter = React.useCallback(() => {
    deleteFilter(item);
  }, [deleteFilter, item]);

  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.closeIcon}>
        <IconButton
          aria-label={apiRef!.current.getLocaleText('filterPanelDeleteIconLabel')}
          title={apiRef!.current.getLocaleText('filterPanelDeleteIconLabel')}
          onClick={handleDeleteFilter}
          size="small"
        >
          <GridCloseIcon fontSize="small" />
        </IconButton>
      </FormControl>
      <FormControl
        variant="standard"
        className={classes.linkOperatorSelect}
        style={{
          display: hasMultipleFilters ? 'block' : 'none',
          visibility: showMultiFilterOperators ? 'visible' : 'hidden',
        }}
      >
        <InputLabel htmlFor={linkOperatorSelectId} id={linkOperatorSelectLabelId}>
          {apiRef!.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <Select
          labelId={linkOperatorSelectLabelId}
          id={linkOperatorSelectId}
          value={multiFilterOperator}
          onChange={changeLinkOperator}
          disabled={!!disableMultiFilterOperator}
          native
        >
          <option key={GridLinkOperator.And.toString()} value={GridLinkOperator.And.toString()}>
            {apiRef!.current.getLocaleText('filterPanelOperatorAnd')}
          </option>
          <option key={GridLinkOperator.Or.toString()} value={GridLinkOperator.Or.toString()}>
            {apiRef!.current.getLocaleText('filterPanelOperatorOr')}
          </option>
        </Select>
      </FormControl>
      <FormControl variant="standard" className={classes.columnSelect}>
        <InputLabel htmlFor={columnSelectId} id={columnSelectLabelId}>
          {apiRef!.current.getLocaleText('filterPanelColumns')}
        </InputLabel>
        <Select
          labelId={columnSelectLabelId}
          id={columnSelectId}
          value={item.columnField || ''}
          onChange={changeColumn}
          native
        >
          {filterableColumns.map((col) => (
            <option key={col.field} value={col.field}>
              {col.headerName || col.field}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" className={classes.operatorSelect}>
        <InputLabel htmlFor={operatorSelectId} id={operatorSelectLabelId}>
          {apiRef!.current.getLocaleText('filterPanelOperators')}
        </InputLabel>
        <Select
          labelId={operatorSelectLabelId}
          id={operatorSelectId}
          value={item.operatorValue}
          onChange={changeOperator}
          native
        >
          {currentColumn?.filterOperators?.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.label ||
                apiRef!.current.getLocaleText(
                  `filterOperator${capitalize(operator.value)}` as GridTranslationKeys,
                )}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" className={classes.filterValueInput}>
        {currentOperator?.InputComponent && (
          <currentOperator.InputComponent
            apiRef={apiRef}
            item={item}
            applyValue={applyFilterChanges}
            {...currentOperator.InputComponentProps}
          />
        )}
      </FormControl>
    </div>
  );
}
