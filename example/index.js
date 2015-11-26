'use strict'

require('./style.less')
var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/property/attributes'),
  require('vigour-element/lib/events/render')
)

// require facebook
var Facebook = require('../lib/')

// inject plain
var plain = require('vigour-js/lib/methods/plain')
var Observable = require('vigour-js/lib/observable')
Observable.prototype.inject(plain)

// create facebook instance

/*

This will read appId from your package.json (pkg.vigour.facebook.appId):

var facebook = new Facebook()

This is the promoted way. For dev purposes you can set the appId and other settings when instantiating:

These are some appId's you can used for web based on domain:

'1523998237921394' // localhost:8081
'1524010964586788' // localhost:8085
'1523994961255055' // 192.168.1.23:8081

*/
console.log('make facebook instance')
var facebook = window.fb = new Facebook({
  appId: '1523998237921394' // localhost:8081
})

/*

It's advised to

var facebook = new Facebook()

*/

var ShareInput = new Element({
  css: 'input-group',
  label: {
    node: 'span'
  },
  message: {
    node: 'input'
  }
}).Constructor

var app = new Element({
  node: document.body,
  topbar: {
    header: {
      text: 'Facebook example app'
    }
  },
  state: {
    text: JSON.stringify(facebook.plain(), false, 2)
  },
  loginButton: {
    node: 'button',
    text: 'Login',
    on: {
      click () {
        console.log('Login clicked!')
        app.log.text.val = 'logging in!'
        facebook.login((err, response) => {
          var txt = 'login callback! err: ' + err + ', response: ' + JSON.stringify(response, false, 2)

          if (!facebook.token.val) {
            txt += ' LOGIN FAILED, NO TOKEN SET'
          } else {
            txt += ' LOGIN SUCCEEDED!!!'
          }

          app.log.text.val = txt

          console.log('---- login callback!', err ? err : '')
          console.log('response', response)
          console.log('facebook.token.val', facebook.token.val)
        })
      }
    }
  },
  logoutButton: {
    node: 'button',
    text: 'Logout',
    on: {
      click () {
        app.log.text.val = 'logging out!'
        facebook.logout((err, response) => {
          var txt = 'logout callback! err: ' + err + ', response: ' + JSON.stringify(response, false, 2)
          if (facebook.token.val) {
            txt += ' LOGOUT FAILED, TOKEN STILL SET'
          } else {
            txt += ' LOGOUT SUCCEEDED!!!'
          }
          app.log.text.val = txt
          console.log('---- LOGOUT DONE!')
        })
      }
    }
  },
  sharing: {
    message: new ShareInput({
      message: {
        text: 'http://www.google.com'
      },
      label: {
        text: {
          val: 'write a link to share:'
        }
      }
    }),
    validate: {
      node: 'button',
      text: 'Share',
      on: {
        click () {
          var message = app.sharing.message.message.node.value
          console.log('lol share that', message)

          app.log.text.val = 'sharing...'

          facebook.share(message, function (err, response) {
            if (!err) {
              app.log.text.val = 'shared success! ' + JSON.stringify(response, false, 2)
              console.log('---- shared dat!!', response)
            } else {
              app.log.text.val = 'share fail! ' + err
              console.error('SHARE ERROR', err)
            }
          })
        }
      }
    },
    reset: {
      node: 'button',
      text: 'Reset',
      on: {
        click () {
          app.sharing.message.message.node.value = ''
        }
      }
    }
  },
  log: {
    text: 'everything is ok'
  }
})

facebook.on('error', function (err) {
  console.error(err)
})

facebook.ready.on(() => {
  console.log('---- facebook.ready!')
  writeStatus()
})

facebook.connectionStatus.on(() => {
  console.log('---- facebook.connectionStatus!', facebook.connectionStatus.val)
  writeStatus()
})

facebook.token.on(() => {
  console.log('---- facebook.token!', facebook.token.val)
  writeStatus()
})

function writeStatus () {
  app.state.text.val = JSON.stringify(facebook.plain(), false, 2)
}
