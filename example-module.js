/* global define */

(function (global) {
  'use strict'

  // Constructor
  function ExampleModule (elem, options) {
    options = options || {}

    // The default settings for the module.
    this.settings = {
      // example:
      // active: false
    }

    // Overwrite defaults where they are provided in options
    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting]
      }
    }

    // Save a reference to the element.
    // Remove this and the elem parameter if not needed
    this.elem = elem

    // initiate listeners object for public events
    this._listeners = {}
  }

  // Example 'assplode' method.
  // Remove or rewrite as a useful method.
  // Can be used internally with `this.assplode('planet')`.
  ExampleModule.prototype.assplode = function (thingToAssplode) {
    // Make it "assplode"
    this.elem.textContent = thingToAssplode.toUpperCase() + 'ASSPLODED!'

    // Fire the assplode event.
    // If so desired, you can pass the parameter
    this._fire('assplode', thingToAssplode)

    return this
  }

  // Fire each registered event
  ExampleModule.prototype._fire = function (type, data) {
    var listeners = this._listeners[type] || []

    listeners.forEach(function (listener) {
      listener(data)
    })
  }

  // On method, like in jQuery, for adding handlers
  ExampleModule.prototype.on = function (type, handler) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = []
    }

    this._listeners[type].push(handler)

    return this
  }

  // Off method for removing listeners
  ExampleModule.prototype.off = function (type, handler) {
    var index = this._listeners[type].indexOf(handler)

    if (index > -1) {
      this._listeners[type].splice(index, 1)
    }

    return this
  }

  // Destroy method for removing all listeners
  ExampleModule.prototype.destroy = function () {
    this._fire('destroy')

    // Remove internal listeners here

    this._listeners = {}

    return this
  }

  // Export ExampleModule
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ExampleModule
  } else if (typeof define === 'function' && define.amd) {
    define('ExampleModule', [], function () {
      return ExampleModule
    })
  } else if (typeof global === 'object') {
    // attach to window
    global.ExampleModule = ExampleModule
  }
}(this))
