import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import { allGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridDragIcon } from '../icons/index';
import { GridPanelContent } from './GridPanelContent';
import { GridPanelFooter } from './GridPanelFooter';
import { GridPanelHeader } from './GridPanelHeader';
import { GridPanelWrapper } from './GridPanelWrapper';
import { GRID_EXPERIMENTAL_ENABLED } from '../../constants';

const useStyles = makeStyles(
  {
    container: {
      padding: '8px 0px 8px 8px',
    },
    column: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1px 8px 1px 7px',
    },
    switch: {
      marginRight: 4,
    },
    dragIcon: {
      justifyContent: 'flex-end',
    },
  },
  { name: 'MuiDataGridColumnsPanel' },
);

export function GridColumnsPanel() {
  const classes = useStyles();
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const { disableColumnReorder } = useGridSelector(apiRef, optionsSelector);
  const [searchValue, setSearchValue] = React.useState('');

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { name } = event.target as HTMLInputElement;
      const column = apiRef!.current.getColumn(name);
      apiRef!.current.setColumnVisibility(name, !!column.hide);
    },
    [apiRef],
  );

  const toggleAllColumns = React.useCallback(
    (value: boolean) => {
      apiRef!.current.updateColumns(
        columns.map((col) => {
          col.hide = value;
          return col;
        }),
      );
    },
    [apiRef, columns],
  );
  const showAllColumns = React.useCallback(() => toggleAllColumns(false), [toggleAllColumns]);
  const hideAllColumns = React.useCallback(() => toggleAllColumns(true), [toggleAllColumns]);

  const handleSearchValueChange = React.useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const currentColumns = React.useMemo(
    () =>
      !searchValue
        ? columns
        : columns.filter(
            (column) =>
              column.field.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
              (column.headerName &&
                column.headerName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1),
          ),
    [columns, searchValue],
  );

  React.useEffect(() => {
    searchInputRef.current!.focus();
  }, []);

  return (
    <GridPanelWrapper>
      <GridPanelHeader>
        <TextField
          label={apiRef!.current.getLocaleText('columnsPanelTextFieldLabel')}
          placeholder={apiRef!.current.getLocaleText('columnsPanelTextFieldPlaceholder')}
          inputRef={searchInputRef}
          value={searchValue}
          onChange={handleSearchValueChange}
          variant="standard"
          fullWidth
        />
      </GridPanelHeader>
      <GridPanelContent>
        <div className={classes.container}>
          {currentColumns.map((column) => (
            <div key={column.field} className={classes.column}>
              <FormControlLabel
                control={
                  <Switch
                    className={classes.switch}
                    checked={!column.hide}
                    onClick={toggleColumn}
                    name={column.field}
                    color="primary"
                    size="small"
                  />
                }
                label={column.headerName || column.field}
              />
              {!disableColumnReorder && GRID_EXPERIMENTAL_ENABLED && (
                <IconButton
                  draggable
                  className={classes.dragIcon}
                  aria-label={apiRef!.current.getLocaleText('columnsPanelDragIconLabel')}
                  title={apiRef!.current.getLocaleText('columnsPanelDragIconLabel')}
                  size="small"
                  disabled
                >
                  <GridDragIcon />
                </IconButton>
              )}
            </div>
          ))}
        </div>
      </GridPanelContent>
      <GridPanelFooter>
        <Button onClick={hideAllColumns} color="primary">
          {apiRef!.current.getLocaleText('columnsPanelHideAllButton')}
        </Button>
        <Button onClick={showAllColumns} color="primary">
          {apiRef!.current.getLocaleText('columnsPanelShowAllButton')}
        </Button>
      </GridPanelFooter>
    </GridPanelWrapper>
  );
}
