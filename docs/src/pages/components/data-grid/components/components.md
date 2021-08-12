---
title: Data Grid - Components
---

# Data Grid - Components

<p class="description">The grid is highly customizable. Override components using the <code>components</code> prop.</p>

## Overriding components

As part of the customization API, the grid allows you to override internal components with the `components` prop.
The prop accepts an object of type [`GridSlotsComponent`](/api/data-grid/#slots).

If you wish to pass additional props in a component slot, you can do it using the `componentsProps` prop. This prop is of type `GridSlotsComponentsProps`.

As an example, you could override the column menu and pass additional props as below.

```jsx
<DataGrid
  rows={rows}
  columns={columns}
  components={{
    ColumnMenu: MyCustomColumnMenu,
  }}
  componentsProps={{
    columnMenu: { background: 'red', counter: rows.length },
  }}
/>
```

**Note**: The casing is different between the `components` (ColumnMenu) and `componentsProps` (columnMenu) props.

### Getting props

While overriding component slots, you might need to access the grid data.
Therefore, the grid exposes a `useGridSlotComponentProps` hook which allows retrieving the following props.

- `state`: the current grid state.
- `rows`: the current rows in the grid.
- `columns`: the current columns in the grid.
- `options`: the current set of options in the grid.
- `apiRef`<span class="pro"></span>: the `GridApi` ref that allows manipulating the grid.
- `rootElement`: the root DOM element.

It can be used as below:

```tsx
function CustomRowCounter() {
  const { rows } = useGridSlotComponentProps();

  return <div>Row count: {rows.length} </div>;
}
```

## Components

The full list of overridable components can be found on the [`GridSlotsComponent`](/api/data-grid/#slots) API page.

### Column menu

As mentioned above, the column menu is a component slot that can be recomposed easily and customized on each column as in the demo below.

{{"demo": "pages/components/data-grid/components/CustomColumnMenu.js", "bg": "inline"}}

Below is the default `GridColumnMenu`.

```tsx
export const GridColumnMenu = React.forwardRef<
  HTMLUListElement,
  GridColumnMenuProps
>(function GridColumnMenu(props: GridColumnMenuProps, ref) {
  const { hideMenu, currentColumn } = props;

  return (
    <GridColumnMenuContainer ref={ref} {...props}>
      <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </GridColumnMenuContainer>
  );
});
```

### Toolbar

To enable the toolbar you need to add the `Toolbar: GridToolbar` to the grid `components` prop.
This demo showcases how this can be achieved.

{{"demo": "pages/components/data-grid/components/ToolbarGrid.js", "bg": "inline"}}

Alternatively, you can compose your own toolbar.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
```

{{"demo": "pages/components/data-grid/components/CustomToolbarGrid.js", "bg": "inline"}}

### Footer

The grid exposes props to hide specific elements of the UI:

- `hideFooter`: If `true`, the footer component is hidden.
- `hideFooterRowCount`: If `true`, the row count in the footer is hidden.
- `hideFooterSelectedRowCount`: If `true`, the selected row count in the footer is hidden.
- `hideFooterPagination`: If `true`, the pagination component in the footer is hidden.

{{"demo": "pages/components/data-grid/components/CustomFooter.js", "bg": "inline"}}

### Pagination

By default, pagination uses the [TablePagination](/components/pagination/#table-pagination) component that is optimized for handling tabular data.
This demo replaces it with the [Pagination](/components/pagination/) component.

{{"demo": "pages/components/data-grid/components/CustomPaginationGrid.js", "bg": "inline"}}

### Loading overlay

By default, the loading overlay displays a circular progress.
This demo replaces it with a linear progress.

{{"demo": "pages/components/data-grid/components/CustomLoadingOverlayGrid.js", "bg": "inline"}}

### No rows overlay

In the following demo, an illustration is added on top of the default "No Rows" message.

{{"demo": "pages/components/data-grid/components/CustomEmptyOverlayGrid.js", "bg": "inline"}}

**Note**: As the no rows overlay, the grid allows to override the no results overlay with the `NoResultsOverlay` slot.

### Icons

As any component slot, every icon can be customized. However, it is not yet possible to use the `componentsProps` with icons.

{{"demo": "pages/components/data-grid/components/CustomSortIcons.js", "bg": "inline"}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [XGrid](/api/data-grid/x-grid/)
