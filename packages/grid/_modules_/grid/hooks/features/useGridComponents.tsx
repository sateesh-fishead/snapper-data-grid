import * as React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIButton from '@material-ui/core/Button';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiRefComponentsProperty } from '../../models/api/gridComponentsApi';
import { GridSlotsComponent } from '../../models/gridSlotsComponent';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';
import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCheckIcon,
  GridCloseIcon,
  GridColumnIcon,
  GridColumnMenu,
  GridColumnsPanel,
  GridFilterAltIcon,
  GridFilterListIcon,
  GridFilterPanel,
  GridFooter,
  GridHeader,
  GridLoadingOverlay,
  GridNoRowsOverlay,
  GridPagination,
  GridPanel,
  GridPreferencesPanel,
  GridSaveAltIcon,
  GridSeparatorIcon,
  GridTableRowsIcon,
  GridTripleDotsVerticalIcon,
  GridViewHeadlineIcon,
  GridViewStreamIcon,
} from '../../components';
import { GridColumnUnsortedIcon } from '../../components/columnHeaders/GridColumnUnsortedIcon';
import { ErrorOverlay } from '../../components/ErrorOverlay';
import { GridNoResultsOverlay } from '../../components/GridNoResultsOverlay';

export const DEFAULT_GRID_SLOTS_COMPONENTS: GridApiRefComponentsProperty = {
  BooleanCellFalseIcon: GridCloseIcon,
  BooleanCellTrueIcon: GridCheckIcon,
  Checkbox: MUICheckbox,
  Collapse: MUIButton,
  ColumnFilteredIcon: GridFilterAltIcon,
  ColumnMenu: GridColumnMenu,
  ColumnMenuIcon: GridTripleDotsVerticalIcon,
  ColumnResizeIcon: GridSeparatorIcon,
  ColumnSelectorIcon: GridColumnIcon,
  ColumnSortedAscendingIcon: GridArrowUpwardIcon,
  ColumnSortedDescendingIcon: GridArrowDownwardIcon,
  ColumnsPanel: GridColumnsPanel,
  ColumnUnsortedIcon: GridColumnUnsortedIcon,
  DensityComfortableIcon: GridViewStreamIcon,
  DensityCompactIcon: GridViewHeadlineIcon,
  DensityStandardIcon: GridTableRowsIcon,
  ErrorOverlay,
  ExportIcon: GridSaveAltIcon,
  FilterPanel: GridFilterPanel,
  Footer: GridFooter,
  Header: GridHeader,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  OpenFilterButtonIcon: GridFilterListIcon,
  Pagination: GridPagination,
  Panel: GridPanel,
  PreferencesPanel: GridPreferencesPanel,
};

export const useGridComponents = (
  apiRef: GridApiRef,
  {
    components,
    componentsProps,
  }: { components?: GridSlotsComponent; componentsProps?: GridSlotsComponentsProps },
) => {
  const mappedComponents: GridApiRefComponentsProperty = React.useMemo(() => {
    return {
      BooleanCellTrueIcon:
        (components && components.BooleanCellTrueIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellTrueIcon,
      BooleanCellFalseIcon:
        (components && components.BooleanCellFalseIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.BooleanCellFalseIcon,
      ColumnFilteredIcon:
        (components && components.ColumnFilteredIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnFilteredIcon,
      ColumnMenuIcon:
        (components && components.ColumnMenuIcon) || DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenuIcon,
      ColumnResizeIcon:
        (components && components.ColumnResizeIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnResizeIcon,
      ColumnSelectorIcon:
        (components && components.ColumnSelectorIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSelectorIcon,
      ColumnUnsortedIcon:
        components?.ColumnUnsortedIcon === undefined
          ? DEFAULT_GRID_SLOTS_COMPONENTS.ColumnUnsortedIcon
          : components?.ColumnUnsortedIcon,
      ColumnSortedAscendingIcon:
        (components && components.ColumnSortedAscendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedAscendingIcon,
      ColumnSortedDescendingIcon:
        (components && components.ColumnSortedDescendingIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.ColumnSortedDescendingIcon,
      DensityComfortableIcon:
        (components && components.DensityComfortableIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityComfortableIcon,
      DensityCompactIcon:
        (components && components.DensityCompactIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityCompactIcon,
      DensityStandardIcon:
        (components && components.DensityStandardIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.DensityStandardIcon,
      ExportIcon: (components && components.ExportIcon) || DEFAULT_GRID_SLOTS_COMPONENTS.ExportIcon,
      OpenFilterButtonIcon:
        (components && components.OpenFilterButtonIcon) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.OpenFilterButtonIcon,
      Checkbox: (components && components.Checkbox) || DEFAULT_GRID_SLOTS_COMPONENTS.Checkbox,
      Collapse: (components && components.Collapse) || DEFAULT_GRID_SLOTS_COMPONENTS.Collapse,
      ColumnMenu: (components && components.ColumnMenu) || DEFAULT_GRID_SLOTS_COMPONENTS.ColumnMenu,
      ErrorOverlay:
        (components && components.ErrorOverlay) || DEFAULT_GRID_SLOTS_COMPONENTS.ErrorOverlay,
      Footer: (components && components.Footer) || DEFAULT_GRID_SLOTS_COMPONENTS.Footer,
      Header: (components && components.Header) || DEFAULT_GRID_SLOTS_COMPONENTS.Header,
      Toolbar: components && components.Toolbar,
      PreferencesPanel:
        (components && components.PreferencesPanel) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.PreferencesPanel,
      LoadingOverlay:
        (components && components.LoadingOverlay) || DEFAULT_GRID_SLOTS_COMPONENTS.LoadingOverlay,
      NoResultsOverlay:
        (components && components.NoResultsOverlay) ||
        DEFAULT_GRID_SLOTS_COMPONENTS.NoResultsOverlay,
      NoRowsOverlay:
        (components && components.NoRowsOverlay) || DEFAULT_GRID_SLOTS_COMPONENTS.NoRowsOverlay,
      Pagination: (components && components.Pagination) || DEFAULT_GRID_SLOTS_COMPONENTS.Pagination,
      FilterPanel:
        (components && components.FilterPanel) || DEFAULT_GRID_SLOTS_COMPONENTS.FilterPanel,
      ColumnsPanel:
        (components && components.ColumnsPanel) || DEFAULT_GRID_SLOTS_COMPONENTS.ColumnsPanel,
      Panel: (components && components.Panel) || DEFAULT_GRID_SLOTS_COMPONENTS.Panel,
    };
  }, [components]);

  apiRef.current.components = mappedComponents;
  apiRef.current.componentsProps = componentsProps;
};
