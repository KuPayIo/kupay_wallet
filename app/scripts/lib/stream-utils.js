const Through = require('through2')
const ObjectMultiplex = require('obj-multiplex')
const pump = require('pump')

module.exports = {
  jsonParseStream: jsonParseStream,
  jsonStringifyStream: jsonStringifyStream,
  setupMultiplex: setupMultiplex,
}

function jsonParseStream () {
  return Through.obj(function (serialized, encoding, cb) {
    this.push(JSON.parse(serialized))
    cb()
  })
}

function jsonStringifyStream () {
  return Through.obj(function (obj, encoding, cb) {
    this.push(JSON.stringify(obj))
    cb()
  })
}

function setupMultiplex (connectionStream) {
  const mux = new ObjectMultiplex()//stream的多路复用
  /**
   * When using standard source.pipe(dest) source will not be destroyed if dest emits close or an error. You are also not able to provide a callback to tell when then pipe has finished.
   * pump does these two things for you
   */
  pump(
    connectionStream,
    mux,
    connectionStream,
    (err) => {
      if (err) console.error(err)
    }
  )
  return mux
}
