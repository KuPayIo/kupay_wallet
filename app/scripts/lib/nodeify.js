const promiseToCallback = require('promise-to-callback')
const noop = function () {}
//只是把promise换成了标准的cb，兼容各种浏览器
module.exports = function nodeify (fn, context) {
  return function () {
    const args = [].slice.call(arguments)
    const lastArg = args[args.length - 1]
    const lastArgIsCallback = typeof lastArg === 'function'
    let callback
    if (lastArgIsCallback) {
      callback = lastArg
      args.pop()
    } else {
      callback = noop
    }
    promiseToCallback(fn.apply(context, args))(callback)
  }
}
