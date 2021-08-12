import {
  getInitialGridFilterState,
  GridApiRef,
  GridComponentProps,
  GridFilterModel,
  GridLinkOperator,
  GridPreferencePanelsValue,
  GridRowModel,
  SUBMIT_FILTER_STROKE_TIME,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import { expect } from 'chai';
import { useData } from 'packages/storybook/src/hooks/useData';
import * as React from 'react';
import { spy, useFakeTimers } from 'sinon';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { getColumnHeaderCell, getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Filter', () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  const TestCase = (props: Partial<GridComponentProps>) => {
    const { rows, ...other } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          apiRef={apiRef}
          {...baselineProps}
          rows={rows || baselineProps.rows}
          disableColumnFilter={false}
          {...other}
        />
      </div>
    );
  };

  const filterModel = {
    items: [
      {
        columnField: 'brand',
        value: 'a',
        operatorValue: 'contains',
      },
    ],
  };

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase filterModel={filterModel} />);

    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly on GridApiRef setRows', () => {
    render(<TestCase filterModel={filterModel} />);

    const newRows = [
      {
        id: 3,
        brand: 'Asics',
      },
      {
        id: 4,
        brand: 'RedBull',
      },
      {
        id: 5,
        brand: 'Hugo',
      },
    ];
    apiRef.current.setRows(newRows);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  it('should apply the filterModel prop correctly on GridApiRef update row data', () => {
    render(<TestCase filterModel={filterModel} />);
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
  });

  it('should allow apiRef to setFilterModel', () => {
    render(<TestCase />);
    apiRef.current.setFilterModel({
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
    });
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and default to AND', () => {
    const newModel = {
      items: [
        {
          id: 1,
          columnField: 'brand',
          value: 'a',
          operatorValue: 'contains',
        },
        {
          id: 2,
          columnField: 'brand',
          value: 'm',
          operatorValue: 'contains',
        },
      ],
    };
    render(<TestCase filterModel={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Puma']);
  });

  it('should allow multiple filter via apiRef', () => {
    render(<TestCase />);
    const newModel = {
      items: [
        {
          id: 1,
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          id: 2,
          columnField: 'brand',
          value: 's',
          operatorValue: 'endsWith',
        },
      ],
    };
    apiRef.current.setFilterModel(newModel);
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and changing the linkOperator', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          id: 1,
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          id: 2,
          columnField: 'brand',
          value: 'a',
          operatorValue: 'endsWith',
        },
      ],
      linkOperator: GridLinkOperator.Or,
    };
    render(<TestCase filterModel={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should trigger onFilterModelChange when the link operator changes but not change the state', () => {
    const onFilterModelChange = spy();
    const newModel: GridFilterModel = {
      items: [
        {
          id: 1,
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          id: 2,
          columnField: 'brand',
          value: 'a',
          operatorValue: 'endsWith',
        },
      ],
    };
    render(
      <TestCase
        filterModel={newModel}
        onFilterModelChange={onFilterModelChange}
        state={{
          preferencePanel: { openedPanelValue: GridPreferencePanelsValue.filters, open: true },
        }}
      />,
    );
    expect(onFilterModelChange.callCount).to.equal(0);
    expect(getColumnValues()).to.deep.equal([]);

    const select = screen.queryAllByRole('combobox', { name: /Operators/i })[1];
    fireEvent.change(select, { target: { value: 'or' } });
    expect(onFilterModelChange.callCount).to.equal(1);
    expect(getColumnValues()).to.deep.equal([]);
  });

  it('should only select visible rows', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
      linkOperator: GridLinkOperator.Or,
    };
    render(<TestCase checkboxSelection filterModel={newModel} />);
    const checkAllCell = getColumnHeaderCell(0).querySelector('input');
    fireEvent.click(checkAllCell);
    expect(apiRef.current.getState().selection).to.deep.equal([1]);
  });

  it('should allow to clear filters by passing an empty filter model', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
    };
    const { setProps } = render(<TestCase filterModel={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Adidas']);
    setProps({ filterModel: { items: [] } });
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });

  it('should show the latest visibleRows', () => {
    render(
      <TestCase
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    const input = screen.getByPlaceholderText('Filter value');
    fireEvent.change(input, { target: { value: 'ad' } });
    clock.tick(SUBMIT_FILTER_STROKE_TIME);
    expect(getColumnValues()).to.deep.equal(['Adidas']);

    expect(apiRef.current.getVisibleRowModels().size).to.equal(1);
    expect(apiRef.current.getVisibleRowModels().get(1)).to.deep.equal({ id: 1, brand: 'Adidas' });
  });

  describe('performance', () => {
    beforeEach(() => {
      clock.restore();
    });

    it('should filter 5,000 rows in less than 100 ms', async function test() {
      // It's simpler to only run the performance test in a single controlled environment.
      if (!/HeadlessChrome/.test(window.navigator.userAgent)) {
        this.skip();
        return;
      }

      const TestCasePerf = () => {
        const data = useData(5000, 10);
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} columns={data.columns} rows={data.rows} />
          </div>
        );
      };

      render(<TestCasePerf />);
      const newModel = {
        items: [
          {
            columnField: 'currencyPair',
            value: 'usd',
            operatorValue: 'startsWith',
          },
        ],
      };
      const t0 = performance.now();
      apiRef.current.setFilterModel(newModel);

      await waitFor(() =>
        expect(document.querySelector('.MuiDataGrid-filterIcon')).to.not.equal(null),
      );
      const t1 = performance.now();
      const time = Math.round(t1 - t0);
      expect(time).to.be.lessThan(150);
    });
  });

  describe('Server', () => {
    it('should refresh the filter panel when adding filters', () => {
      function loadServerRows(commodityFilterValue) {
        const serverRows = [
          { id: '1', commodity: 'rice' },
          { id: '2', commodity: 'soybeans' },
          { id: '3', commodity: 'milk' },
          { id: '4', commodity: 'wheat' },
          { id: '5', commodity: 'oats' },
        ];

        return new Promise<GridRowModel[]>((resolve) => {
          if (!commodityFilterValue) {
            resolve(serverRows);
            return;
          }
          resolve(
            serverRows.filter(
              (row) => row.commodity.toLowerCase().indexOf(commodityFilterValue) > -1,
            ),
          );
        });
      }

      const columns = [{ field: 'commodity', width: 150 }];

      function AddServerFilterGrid() {
        const [rows, setRows] = React.useState<GridRowModel[]>([]);
        const [filterValue, setFilterValue] = React.useState();

        const handleFilterChange = React.useCallback((newFilterModel: GridFilterModel) => {
          setFilterValue(newFilterModel.items[0].value);
        }, []);

        React.useEffect(() => {
          let active = true;

          (async () => {
            const newRows = await loadServerRows(filterValue);

            if (!active) {
              return;
            }

            setRows(newRows);
          })();

          return () => {
            active = false;
          };
        }, [filterValue]);

        return (
          <div style={{ height: 400, width: 400 }}>
            <XGrid
              rows={rows}
              columns={columns}
              filterMode="server"
              onFilterModelChange={handleFilterChange}
              state={{
                preferencePanel: {
                  open: true,
                  openedPanelValue: GridPreferencePanelsValue.filters,
                },
              }}
            />
          </div>
        );
      }

      render(<AddServerFilterGrid />);
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiGridFilterForm-root`);
      expect(filterForms).to.have.length(2);
    });
  });

  it('should display the number of results in the footer', () => {
    const { setProps } = render(<TestCase />);
    expect(screen.getByText('Total Rows: 3')).not.to.equal(null);
    setProps({ filterModel });
    expect(screen.getByText('Total Rows: 2 of 3')).not.to.equal(null);
  });

  describe('control Filter', () => {
    it('should update the filter state when neither the model nor the onChange are set', () => {
      render(
        <TestCase
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiGridFilterForm-root`);
      expect(filterForms).to.have.length(2);
    });

    it('should not update the filter state when the filterModelProp is set', () => {
      const testFilterModel: GridFilterModel = { items: [], linkOperator: GridLinkOperator.Or };
      render(
        <TestCase
          filterModel={testFilterModel}
          state={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiGridFilterForm-root`);
      expect(filterForms).to.have.length(0);
    });

    it('should update the filter state when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      const { setProps } = render(<TestCase onFilterModelChange={onModelChange} />);
      expect(onModelChange.callCount).to.equal(0);
      setProps({
        state: {
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        },
      });
      expect(onModelChange.callCount).to.equal(1);
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiGridFilterForm-root`);
      expect(filterForms).to.have.length(2);
      expect(onModelChange.callCount).to.equal(2);
      expect(onModelChange.lastCall.firstArg.items.length).to.deep.equal(2);
      expect(onModelChange.lastCall.firstArg.linkOperator).to.deep.equal(GridLinkOperator.And);
    });

    it('should control filter state when the model and the onChange are set', () => {
      const ControlCase = (props: Partial<GridComponentProps>) => {
        const { rows, columns, ...others } = props;
        const [caseFilterModel, setFilterModel] = React.useState<any>(getInitialGridFilterState());
        const handleFilterChange = (newModel) => {
          setFilterModel(newModel);
        };

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid
              autoHeight={isJSDOM}
              columns={columns || baselineProps.columns}
              rows={rows || baselineProps.rows}
              filterModel={caseFilterModel}
              onFilterModelChange={handleFilterChange}
              state={{
                preferencePanel: {
                  open: true,
                  openedPanelValue: GridPreferencePanelsValue.filters,
                },
              }}
              {...others}
            />
          </div>
        );
      };

      render(<ControlCase />);
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      fireEvent.click(addButton);

      const filterForms = document.querySelectorAll(`.MuiGridFilterForm-root`);
      expect(filterForms).to.have.length(2);
    });
  });
});
