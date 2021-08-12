---
title: Data Grid - Paging
---

# Data Grid - Pagination

<p class="description">Through paging, a segment of data can be viewed from the assigned data source.</p>

By default, the MIT `DataGrid` displays the rows with pagination, and up to 100 rows per page.

On the other hand, the commercial `XGrid` component displays, by default, all the rows with infinite scrolling (and virtualization) and without the 100 rows per page limitation. You need to set the `pagination` prop to enable the pagination feature in such a case.

## Basic example

{{"demo": "pages/components/data-grid/pagination/BasicPaginationGrid.js", "bg": "inline"}}

## Page size

- The default page size is `100`, you can change this value with the `pageSize` prop.
- You can configure the possible page size the user can choose from with the `rowsPerPageOptions` prop.

{{"demo": "pages/components/data-grid/pagination/SizePaginationGrid.js", "bg": "inline"}}

## Controlled pagination

While the previous demos show how the pagination can be uncontrolled, the active page can be controlled with the `page`/`onPageChange` props.

{{"demo": "pages/components/data-grid/pagination/ControlledPaginationGrid.js", "bg": "inline"}}

## Auto size

The `autoPageSize` prop allows to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.
By default, this feature is off.

{{"demo": "pages/components/data-grid/pagination/AutoPaginationGrid.js", "bg": "inline"}}

## Server-side pagination

By default, pagination works on the client-side.
To switch it to server-side, set `paginationMode="server"`.
You also need to set the `rowCount` prop to so the grid know the total number of pages.
Finally, you need to handle the `onPageChange` callback to load the rows for the corresponding page.

{{"demo": "pages/components/data-grid/pagination/ServerPaginationGrid.js", "bg": "inline"}}

## Cursor-based pagination

You can adapt the pagination for your cursor-based pagination.
To do so, you just have to keep track of the next cursor associated with each page you fetched.

{{"demo": "pages/components/data-grid/pagination/CursorPaginationGrid.js", "bg": "inline"}}

## Customization

You can customize the rendering of the pagination in the footer following [the component section](/components/data-grid/components/#pagination) of the documentation.

## Paginate > 100 rows [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

The `DataGrid` component can display up to 100 rows per page.
The `XGrid` component removes this limitation.
The following demo displays 200 rows per page:

{{"demo": "pages/components/data-grid/pagination/200PaginationGrid.js", "disableAd": true, "bg": "inline"}}

## apiRef [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

The grid exposes a set of methods that enables all of these features using the imperative apiRef.

> ⚠️ Only use this API when you have no alternative. Always start from the declarative API that the grid exposes.

- `setPageSize`: Set the number of rows in one page.
- `setPage`: Set the displayed page.
- `onPageChange`: Callback fired after a new page has been displayed.
- `onPageSizeChange`: Callback fired after the page size was changed.

Below is an example of how you can reset the page using the imperative `setPage` method.

{{"demo": "pages/components/data-grid/pagination/ApiRefPaginationGrid.js", "bg": "inline", "disableAd": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [XGrid](/api/data-grid/x-grid/)
