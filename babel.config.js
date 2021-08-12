let defaultPresets;

// We release a ES version of Material-UI.
// It's something that matches the latest official supported features of JavaScript.
// Nothing more (stage-1, etc), nothing less (require, etc).
if (process.env.BABEL_ENV === 'es') {
  defaultPresets = [];
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: ['esm', 'production-umd'].includes(process.env.BABEL_ENV) ? false : 'commonjs',
      },
    ],
  ];
}

const defaultAlias = {
  '@material-ui/data-grid': './packages/grid/data-grid/src',
  '@material-ui/x-grid-data-generator': './packages/grid/x-grid-data-generator/src',
  '@material-ui/x-grid': './packages/grid/x-grid/src',
  '@material-ui/x-license': './packages/x-license/src',
};

module.exports = {
  presets: defaultPresets.concat(['@babel/preset-react', '@babel/preset-typescript']),
  plugins: [
    'babel-plugin-optimize-clsx',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
    ['@babel/plugin-transform-runtime', { version: '^7.4.4' }],
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
    'babel-plugin-istanbul',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.ts', '.tsx'],
        alias: defaultAlias,
      },
    ],
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  env: {
    coverage: {},
    test: {
      sourceMaps: 'both',
    },
  },
};
