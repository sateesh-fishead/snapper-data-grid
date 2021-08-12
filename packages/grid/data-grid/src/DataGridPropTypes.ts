import PropTypes from 'prop-types';
import { chainPropTypes } from '@material-ui/utils';
import { MAX_PAGE_SIZE } from './DataGridProps';

// @ts-ignore
export const DATA_GRID_PROPTYPES = {
  apiRef: chainPropTypes(PropTypes.any, (props: any) => {
    if (props.apiRef != null) {
      return new Error(
        [
          `Material-UI: \`apiRef\` is not a valid prop.`,
          'GridApiRef is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  checkboxSelectionVisibleOnly: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.checkboxSelectionVisibleOnly === true) {
      return new Error(
        [
          `Material-UI: \`<DataGrid checkboxSelectionVisibleOnly={true} />\` is not a valid prop.`,
          'Selecting all columns only on the current page is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  columns: chainPropTypes(PropTypes.array.isRequired, (props: any) => {
    if (props.columns && props.columns.some((column) => column.resizable)) {
      return new Error(
        [
          `Material-UI: \`column.resizable = true\` is not a valid prop.`,
          'Column resizing is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableColumnReorder: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableColumnReorder === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableColumnReorder={false} />\` is not a valid prop.`,
          'Column reordering is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableColumnResize: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableColumnResize === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableColumnResize={false} />\` is not a valid prop.`,
          'Column resizing is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableMultipleColumnsFiltering: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableMultipleColumnsFiltering === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleColumnsFiltering={false} />\` is not a valid prop.`,
          'Only single column sorting is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableMultipleColumnsSorting: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableMultipleColumnsSorting === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleColumnsSorting={false} />\` is not a valid prop.`,
          'Only single column sorting is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableMultipleSelection: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableMultipleSelection === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleSelection={false} />\` is not a valid prop.`,
          'Only single column selection is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  filterModel: chainPropTypes(PropTypes.any, (props: any) => {
    if (props.filterModel != null && props.filterModel.items.length > 1) {
      return new Error(
        [
          `Material-UI: \`<DataGrid filterModel={model} />\` is not a valid prop. \`model.items\` has more than 1 item.`,
          'Only single filter is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  onRowsScrollEnd: chainPropTypes(PropTypes.any, (props: any) => {
    if (props.onRowsScrollEnd != null) {
      return new Error(
        [
          `Material-UI: \`onRowsScrollEnd\` is not a valid prop.`,
          'onRowsScrollEnd is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  pageSize: chainPropTypes(PropTypes.number, (props: any) => {
    if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
      return new Error(
        [
          `Material-UI: \`<DataGrid pageSize={${props.pageSize}} />\` is not a valid prop.`,
          `Only page size below ${MAX_PAGE_SIZE} is available in the MIT version.`,
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  pagination: (props: any) => {
    if (props.pagination === false) {
      return new Error(
        [
          'Material-UI: `<DataGrid pagination={false} />` is not a valid prop.',
          'Infinite scrolling is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to disable the pagination.',
        ].join('\n'),
      );
    }
    return null;
  },
  rows: PropTypes.array.isRequired,
  scrollEndThreshold: chainPropTypes(PropTypes.number, (props: any) => {
    if (props.scrollEndThreshold) {
      return new Error(
        [
          `Material-UI: \`<DataGrid scrollEndThreshold={${props.scrollEndThreshold}} />\` is not a valid prop.`,
          'scrollEndThreshold is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  selectionModel: chainPropTypes(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    (props: any) => {
      if (
        !props.checkboxSelection &&
        Array.isArray(props.selectionModel) &&
        props.selectionModel.length > 1
      ) {
        return new Error(
          [
            `Material-UI: \`<DataGrid selectionModel={${JSON.stringify(
              props.selectionModel,
            )}} />\` is not a valid prop.`,
            'selectionModel can only be of 1 item in DataGrid.',
            '',
            'You need to upgrade to the XGrid component to unlock multiple selection.',
          ].join('\n'),
        );
      }
      return null;
    },
  ),
} as any;
