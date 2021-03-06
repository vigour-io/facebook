'use strict'

var bridge = require('vigour-wrapper-bridge')
// var pkg = require('../package.json')
// var _pluginId = pkg.name
var _pluginId = 'facebook'

// Mutate the bridge to call these fake native methods:

var fakeMethods = {
  init () {
    setTimeout(() => {
      bridge.ready(null, true, _pluginId)
    })
  },
  login (callback) {
    console.log('fake login!')
    // go to facebook app
    setTimeout(() => {
      if (!window.facebookFail) {
        // got a token!
        var response = {
          status: 'connected',
          authResponse: {
            accessToken: 'someToken'
          }
        }
        callback(null, response)
      } else {
        // failed!
        callback('failed to get token!')
      }
    })
  },
  share (shared, callback) {
    console.log('fake share!')
    // go to facebook app
    setTimeout(() => {
      if (!window.facebookFail) {
        // shared successfully!
        callback(null)
      } else {
        // failed!
        callback('failed to share!')
      }
    })
  }
}

var _send = bridge.send
bridge.send = function send (pluginId, fnName, opts, cb) {
  if (pluginId) {
    if (pluginId !== _pluginId) {
      throw new Error('this is for fake Facebook ya bum! not ' + pluginId)
    }
    return fakeMethods[fnName](opts, cb)
  } else {
    return _send.apply(bridge, arguments)
  }
}
