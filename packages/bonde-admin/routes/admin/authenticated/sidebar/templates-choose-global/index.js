// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

//
// @path (admin) /mobilizations/:mobilization_id/templates/choose/global
//
export default store => ({
  path: 'mobilizations/:mobilization_id/templates/choose/global',
  getComponent (nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('./page.connected').default)
    })
  }
})
