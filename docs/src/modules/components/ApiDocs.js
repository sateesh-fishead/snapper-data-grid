import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import HighlightedCode from '../../../node_modules/@material-ui/monorepo/docs/src/modules/components/HighlightedCode';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    direction: 'ltr',
    lineHeight: 1.4,
    display: 'inline-block',
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    WebkitFontSmoothing: 'subpixel-antialiased',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    '& code': {
      color: theme.palette.secondary.main,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  content: {
    display: 'block',
  },
  code: {
    '& pre': {
      marginBottom: theme.spacing(1),
    },
  },
}));

function ApiDocs(props) {
  const { api } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {api.properties.map((property, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`api-property-${index}-content`}
            id={`api-property-${index}-header`}
          >
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            <Typography className={classes.heading}>{`${property.name}()`}</Typography>
            <Typography
              className={classes.secondaryHeading}
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </AccordionSummary>
          <AccordionDetails className={classes.content}>
            {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
            <Typography variant="subtitle2">Signature:</Typography>
            <HighlightedCode
              className={classes.code}
              code={`${property.name}: ${property.type}`}
              language="tsx"
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

ApiDocs.propTypes = {
  api: PropTypes.object.isRequired,
};

export default ApiDocs;
