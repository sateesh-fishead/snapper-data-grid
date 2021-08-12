import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';
import { expect } from 'chai';
import { DataGrid, DataGridProps } from '@material-ui/data-grid';
import { getColumnValues, getColumnHeaderCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Sorting', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        isPublished: false,
      },
      {
        id: 1,
        brand: 'Adidas',
        isPublished: true,
      },
      {
        id: 2,
        brand: 'Puma',
        isPublished: true,
      },
    ],
    columns: [{ field: 'brand' }, { field: 'isPublished', type: 'boolean' }],
  };

  it('should keep the initial order', () => {
    const cols = [{ field: 'id' }];
    const rows = [{ id: 10 }, { id: 0 }, { id: 5 }];

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid autoHeight={isJSDOM} columns={cols} rows={rows} />
      </div>,
    );
    expect(getColumnValues()).to.deep.equal(['10', '0', '5']);
  });

  it('should update the order server side', () => {
    const cols = [{ field: 'id' }];
    const rows = [{ id: 10 }, { id: 0 }, { id: 5 }];

    function Demo(props) {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid autoHeight={isJSDOM} columns={cols} sortingMode="server" {...props} />
        </div>
      );
    }

    const { setProps } = render(<Demo rows={rows} />);
    expect(getColumnValues()).to.deep.equal(['10', '0', '5']);
    setProps({ rows: [{ id: 5 }, { id: 0 }, { id: 10 }] });
    expect(getColumnValues()).to.deep.equal(['5', '0', '10']);
  });

  it('should sort string column when clicking the header cell', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} />
      </div>,
    );
    const header = getColumnHeaderCell(0);
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    fireEvent.click(header);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    fireEvent.click(header);
    expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
  });

  it('should sort boolean column when clicking the header cell', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} />
      </div>,
    );
    const header = screen
      .getByRole('columnheader', { name: 'isPublished' })
      .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    fireEvent.click(header);
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    fireEvent.click(header);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma', 'Nike']);
  });

  it('should keep rows sorted when rows prop change', () => {
    interface TestCaseProps {
      rows: any[];
    }

    const TestCase = (props: TestCaseProps) => {
      const { rows } = props;
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            rows={rows}
            sortModel={[
              {
                field: 'brand',
                sort: 'asc',
              },
            ]}
          />
        </div>
      );
    };

    const { setProps } = render(<TestCase rows={baselineProps.rows} />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);

    setProps({
      rows: [
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
      ],
    });
    expect(getColumnValues()).to.deep.equal(['Asics', 'Hugo', 'RedBull']);
  });

  it('should support server-side sorting', () => {
    interface TestCaseProps {
      rows: any[];
    }

    const TestCase = (props: TestCaseProps) => {
      const { rows } = props;
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            sortingMode="server"
            rows={rows}
            sortModel={[
              {
                field: 'brand',
                sort: 'desc',
              },
            ]}
          />
        </div>
      );
    };

    const rows = [
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

    const { setProps } = render(<TestCase rows={[rows[0], rows[1]]} />);
    expect(getColumnValues()).to.deep.equal(['Asics', 'RedBull']);
    setProps({ rows });
    expect(getColumnValues()).to.deep.equal(['Asics', 'RedBull', 'Hugo']);
  });

  it('should support new dataset', () => {
    const TestCase = (props: { rows: any[]; columns: any[] }) => {
      const { rows, columns } = props;
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid autoHeight={isJSDOM} rows={rows} columns={columns} />
        </div>
      );
    };

    const { setProps } = render(<TestCase {...baselineProps} />);

    const header = screen
      .getByRole('columnheader', { name: 'brand' })
      .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    fireEvent.click(header);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    const newData = {
      rows: [
        {
          id: 0,
          country: 'France',
        },
        {
          id: 1,
          country: 'UK',
        },
        {
          id: 12,
          country: 'US',
        },
      ],
      columns: [{ field: 'country' }],
    };
    setProps(newData);
    expect(getColumnValues()).to.deep.equal(['France', 'UK', 'US']);
  });

  it('should clear the sorting col when passing an empty sortModel', () => {
    const TestCase = (props: Partial<DataGridProps>) => {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} {...props} />
        </div>
      );
    };

    const { setProps } = render(<TestCase sortModel={[{ field: 'brand', sort: 'asc' }]} />);

    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    setProps({ sortModel: [] });
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });
});
