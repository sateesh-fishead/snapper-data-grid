import * as React from 'react';
import { GridCellCollapseRenderer } from '../../components/columnSelection/GridCellCollapseRenderer';
import { selectedIdsLookupSelector } from '../../hooks/features/selection/gridSelectionSelector';
import { GridColDef } from './gridColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';

const HeaderData = React.forwardRef<HTMLDivElement, GridColumnHeaderParams>(
    function HeaderData(props, ref) {
        return(
            <div ref={ref}>s</div>
        )
    }
)

export const gridCollapseSelectionColDef: GridColDef = {
  ...GRID_BOOLEAN_COL_DEF,
  field: '__collapse__',
  type: 'toggleRow',
  width: 50,
  resizable: false,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  disableReorder: true,
  valueGetter: (params) => {
    const selectionLookup = selectedIdsLookupSelector(params.api.getState());
    return selectionLookup[params.id] !== undefined;
  },
    renderHeader: (params) => <HeaderData {...params} />,
  renderCell: (params) => <GridCellCollapseRenderer {...params} />,
  cellClassName: 'MuiDataGrid-button',
  headerClassName: 'MuiDataGrid-columnHeaderCollapse',
};
