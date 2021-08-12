const path = require('path');

// This module isn't used to build the documentation. We use Next.js for that.
// This module is used by the visual regression tests to run the demos.
module.exports = {
  context: path.resolve(__dirname),
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      '@material-ui/data-grid': path.resolve(__dirname, './packages/grid/data-grid/src'),
      '@material-ui/x-grid-data-generator': path.resolve(
        __dirname,
        './packages/grid/x-grid-data-generator/src',
      ),
      '@material-ui/x-grid': path.resolve(__dirname, './packages/grid/x-grid/src'),
      '@material-ui/x-license': path.resolve(__dirname, './packages/x-license/src'),
      docs: path.resolve(__dirname, './docs/node_modules/@material-ui/monorepo/docs'),
      docsx: path.resolve(__dirname, './docs'),
    },
    extensions: ['.js', '.ts', '.tsx', '.d.ts'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules\/(?!@material-ui)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.tsx$/,
        loader: 'string-replace-loader',
        options: {
          search: '__RELEASE_INFO__',
          replace: 'MTU5NjMxOTIwMDAwMA==', // 2020-08-02
        },
      },
    ],
  },
};
