/* eslint-env mocha */
import './utils/init';
import '@material-ui/monorepo/test/utils/setupKarma';

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);
