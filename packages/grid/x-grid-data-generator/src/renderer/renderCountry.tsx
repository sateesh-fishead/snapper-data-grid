import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { GridCellParams } from '@material-ui/x-grid';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined' && isoCode
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  flag: {
    marginRight: 4,
    marginTop: 2,
    height: 32,
    width: 32,
    fontSize: '28px',
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface CountryProps {
  value: {
    code: string;
    label: string;
  };
}

const Country = React.memo(function Country(props: CountryProps) {
  const { value } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.flag}>{value.code && countryToFlag(value.code)}</span>
      <span className={classes.label}>{value.label}</span>
    </div>
  );
});

export function renderCountry(params: GridCellParams) {
  return <Country value={params.value as any} />;
}
