import * as React from 'react';
import { GridApiRef } from '../../../models';
import { useGridSelector, useGridState } from '../core';
import { useLogger } from '../../utils';
import { GRID_PAGE_CHANGE, GRID_PAGE_SIZE_CHANGE } from '../../../constants';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridApiEventHandler, useGridApiMethod } from '../../root';
import { GridPageApi } from '../../../models/api/gridPageApi';
import { GridPaginationState } from './gridPaginationState';
import { visibleGridRowCountSelector } from '../filter';

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

const applyValidPage = (paginationState: GridPaginationState): GridPaginationState => {
  if (!paginationState.pageCount) {
    return paginationState;
  }

  return {
    ...paginationState,
    page: Math.max(Math.min(paginationState.page, paginationState.pageCount - 1), 0),
  };
};

export const useGridPage = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'page' | 'onPageChange' | 'rowCount'>,
) => {
  const logger = useLogger('useGridPage');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);

      setGridState((state) => ({
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          page,
        }),
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    apiRef.current.updateControlState({
      stateId: 'page',
      propModel: props.page,
      propOnChange: props.onPageChange,
      stateSelector: (state) => state.pagination.page,
      changeEvent: GRID_PAGE_CHANGE,
    });
  }, [apiRef, props.page, props.onPageChange]);

  React.useEffect(() => {
    setGridState((state) => {
      const rowCount = props.rowCount !== undefined ? props.rowCount : visibleRowCount;
      const pageCount = getPageCount(rowCount, state.pagination.pageSize);

      const page = props.page == null ? state.pagination.page : props.page;

      return {
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          page,
          rowCount,
          pageCount,
        }),
      };
    });
    forceUpdate();
  }, [setGridState, forceUpdate, visibleRowCount, props.rowCount, props.page, apiRef]);

  const handlePageSizeChange = React.useCallback(
    (pageSize: number) => {
      setGridState((state) => {
        const pageCount = getPageCount(state.pagination.rowCount, pageSize);

        return {
          ...state,
          pagination: applyValidPage({
            ...state.pagination,
            pageCount,
            page: state.pagination.page,
          }),
        };
      });

      forceUpdate();
    },
    [setGridState, forceUpdate],
  );

  useGridApiEventHandler(apiRef, GRID_PAGE_SIZE_CHANGE, handlePageSizeChange);

  const pageApi: GridPageApi = {
    setPage,
  };

  useGridApiMethod(apiRef, pageApi, 'GridPageApi');
};
