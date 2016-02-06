'use strict'

var log = require('npmlog')

module.exports = exports = {}

exports.start = function () {
  log.info('- configuring facebook -')
  var fbAppId = this.opts.vigour.facebook.appId
  log.info('App ID', fbAppId)
  if (this.platform === 'android') {
    if (!this.strings) {
      this.strings = {}
    }
    if (!this.strings['facebook_app_id']) {
      this.strings['facebook_app_id'] = fbAppId
    }
  } else if (this.platform === 'ios') {
    // TODO
  }
  log.info('-----')
}
