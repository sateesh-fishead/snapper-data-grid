import * as React from 'react';
import { GridCellParams } from '@material-ui/data-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { createTheme } from '../../../_modules_/grid/utils/utils';
import { INCOTERM_OPTIONS } from '../services/static-data';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      select: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
      },
      optionIcon: {
        minWidth: 40,
      },
      optionText: {
        overflow: 'hidden',
      },
    }),
  { defaultTheme },
);

function EditIncoterm(props: GridCellParams) {
  const classes = useStyles();
  const { id, value, api, field } = props;

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    if (!event.key) {
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, 'view');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      api.setCellMode(id, field, 'view');
    }
  };

  return (
    <Select
      value={value}
      classes={{ select: classes.select }}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      autoFocus
      fullWidth
      open
    >
      {INCOTERM_OPTIONS.map((option) => {
        const tooltip = option.slice(option.indexOf('(') + 1, option.indexOf(')'));
        const code = option.slice(0, option.indexOf('(')).trim();

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon className={classes.optionIcon}>
              <span>{code}</span>
            </ListItemIcon>
            <ListItemText className={classes.optionText} primary={tooltip} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditIncoterm(params: GridCellParams) {
  return <EditIncoterm {...params} />;
}
