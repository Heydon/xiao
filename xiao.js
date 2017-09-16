(function (window) {
  'use strict'

  function Xiao (routes, defaultId, options) {
    options = options || {}
    this.settings = {
      //
    }

    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting]
      }
    }

    this.routes = routes
    this.defaultId = defaultId
    this.ids = routes.map((route) => route.id)
    this._listeners = {}

    var routeById = (id) => {
      return this.routes.find((route) => id === route.id)
    }

    var linksById = (id) => {
      return document.querySelectorAll('[href^="#' + id + '"]')
    }

    var routeExists = (route) => {
      return this.ids.find((id) => id === route)
    }

    var reconfigure = (newId, oldId) => {
      this.ids.forEach(function (id) {
        document.getElementById(id).hidden = true
      })

      var newRegion = document.getElementById(newId)
      if (newRegion) {
        newRegion.hidden = false
        newRegion.focus()
      }

      if (oldId && routeExists(oldId)) {
        routeById(oldId).departed()
      }
      routeById(newId).arrived()

      Array.prototype.forEach.call(linksById(newId), (link) => {
        link.setAttribute('aria-current', 'page')
      })
      Array.prototype.forEach.call(linksById(oldId), (link) => {
        link.removeAttribute('aria-current')
      })
    }

    window.addEventListener('load', (e) => {
      this.routes.forEach(route => {
        var region = document.getElementById(route.id)
        region.setAttribute('tabindex', '-1')
        region.setAttribute('role', 'region')
        region.setAttribute('aria-label', route.label)
      })

      var hash = window.location.hash

      if (hash === '' || !routeExists(hash.substr(1))) {
        this.reroute(this.defaultId)
      } else {
        reconfigure(hash.substr(1))
      }

      this._fire('init')
    })

    window.addEventListener('hashchange', (e) => {
      var newId = window.location.hash.substr(1)

      if (routeExists(newId)) {
        var oldId = e.oldURL.indexOf('#') > -1 ? e.oldURL.substr(e.oldURL.indexOf('#') + 1) : null

        reconfigure(newId, oldId)

        this._fire('reroute', {
          newID: newId,
          oldID: oldId
        })
      }
    })
  }

  Xiao.prototype.reroute = function (hash) {
    window.location.hash = hash

    return this
  }

  Xiao.prototype._fire = function (type, data) {
    var listeners = this._listeners[type] || []

    listeners.forEach(function (listener) {
      listener(data)
    })
  }

  Xiao.prototype.on = function (type, handler) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = []
    }

    this._listeners[type].push(handler)

    return this
  }

  Xiao.prototype.off = function (type, handler) {
    var index = this._listeners[type].indexOf(handler)

    if (index > -1) {
      this._listeners[type].splice(index, 1)
    }

    return this
  }

  window.Xiao = Xiao
}(this))
