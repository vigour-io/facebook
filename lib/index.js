'use strict'

const Observable = require('vigour-observable')
const pluginObj = new Observable({
  inject: require('./platform'),
  status: false,
  shared: false,
  ready: false,
  login: {
    token: false,
    val: false,
    id: false,
    on: {
      data: {
        facebook (data, done) {
          if (data) {
            if (this.compute() === true) {
              this.parent._platform.emit('login', (err, res) => {
                if (err) { this.set(void 0, false) }
              })
            }
          } else {
            this.parent._platform.emit('logout', done)
          }
        }
      }
    }
  },
  on: {
    data: {
      facebook (data) {
        if (data) {
          this._platform.emit('init', data)
        }
      }
    }
  }
})

pluginObj.set({
  scope: 'public_profile, email',
  web: {
    version: 'v2.5',
    src: '//connect.facebook.net/en_NL/sdk.js'
  }
})

module.exports = pluginObj
