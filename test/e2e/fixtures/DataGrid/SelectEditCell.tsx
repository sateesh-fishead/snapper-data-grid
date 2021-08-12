import * as React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DataGrid, GridCellParams } from '@material-ui/data-grid';

const SelectEditInputCell = (props: GridCellParams) => {
  const { id, value, api, field } = props;

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    api.commitCellChange({ id, field });
    api.setCellMode(id, field, 'view');
  };

  return (
    <Select value={value} onChange={handleChange} open>
      <MenuItem value="Nike">Nike</MenuItem>
      <MenuItem value="Adidas">Adidas</MenuItem>
      <MenuItem value="Puma">Puma</MenuItem>
      <MenuItem value="Gucci">Gucci</MenuItem>
    </Select>
  );
};

function renderSelectEditInputCell(params) {
  return <SelectEditInputCell {...params} />;
}

const baselineProps = {
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
  columns: [
    {
      field: 'brand',
      width: 100,
      editable: true,
      renderEditCell: renderSelectEditInputCell,
    },
  ],
};

export default function SelectEditCell() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid {...baselineProps} />
    </div>
  );
}
