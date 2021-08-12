import * as React from 'react';
import Rating from '@material-ui/lab/Rating';
import { GridCellParams } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '24px',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
    '& .MuiRating-root': {
      marginRight: theme.spacing(1),
    },
  },
}));

function EditRating(props: GridCellParams) {
  const { id, value, api, field } = props;
  const classes = useStyles();

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: Number(event.target.value) }, event);
    // Check if the event is not from the keyboard
    // https://github.com/facebook/react/issues/7407
    if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, 'view');
    }
  };

  const handleRef = (element) => {
    if (element) {
      element.querySelector(`input[value="${value}"]`).focus();
    }
  };

  return (
    <div className={classes.root}>
      <Rating
        ref={handleRef}
        name="rating"
        value={Number(value)}
        precision={1}
        onChange={handleChange}
      />
      {Number(value)}
    </div>
  );
}

export function renderEditRating(params) {
  return <EditRating {...params} />;
}
