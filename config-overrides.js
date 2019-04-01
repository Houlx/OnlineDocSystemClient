const { override, fixBabelImports, addLessLoader } = require('customize-cra')
// const rewireLess = require('react-app-rewire-less')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  })
)