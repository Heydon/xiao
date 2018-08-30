/* global CustomEvent */

(function (window) {
  'use strict';

  function Xiao(routes, defaultId, options) {
    var _this = this;

    options = options || {};
    this.settings = {
      showHide: true,
      separator: '|',
      arrived: null,
      departed: null
    };

    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting];
      }
    }

    this.ids = routes.map(function (route) {
      return route.id;
    });
    this.title = document.title;
    this.firstRun = true;

    var elem = function elem(id) {
      return document.getElementById(id);
    };

    var url = function url() {
      return window.location.href;
    };

    var each = Array.prototype.forEach;

    var routeById = function routeById(id) {
      return routes.find(function (route) {
        return id === route.id;
      });
    };

    var linksById = function linksById(id) {
      return document.querySelectorAll('[href*="#' + id + '"]');
    };

    var idByURL = function idByURL(string) {
      return string.indexOf('#') > -1 ? string.match(/#.*?(\?|$)/gi)[0].replace('?', '').substr(1) : null;
    };

    var paramsToObj = function paramsToObj(string) {
      var query = string.indexOf('#') > -1 ? string.match(/\?.*?(#|$)/gi)[0].replace('#', '').substr(1) : null;
      return query ? JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : null;
    };

    var routeExists = function routeExists(id) {
      return _this.ids.find(function (route) {
        return elem(route).contains(elem(id));
      });
    };

    var getLabel = function getLabel(route) {
      var h = elem(route.id).querySelector('h1, h2');
      return h ? h.textContent : route.label ? route.label : route.id;
    };

    var reconfigure = function reconfigure(newRoute, oldRoute, oldURL, focusId) {
      if (_this.settings.showHide) {
        _this.ids.forEach(function (id) {
          elem(id).hidden = true;
        });
      }

      var newRegion = elem(newRoute);
      if (newRegion) {
        if (_this.settings.showHide) {
          newRegion.hidden = false;
        }
        if (!_this.firstRun) {
          elem(focusId).setAttribute('tabindex', '-1');
          elem(focusId).focus();
        } else {
          _this.firstRun = false;
        }
      }

      var oldParams = oldURL ? paramsToObj(oldURL) : null;

      if (oldRoute && routeExists(oldRoute)) {
        if (_this.settings.departed) {
          _this.settings.departed(elem(oldRoute), oldParams, routes);
        }
        if (routeById(oldRoute).departed) {
          routeById(oldRoute).departed(elem(oldRoute), oldParams, routes);
        }
      }

      var newParams = paramsToObj(url());
      if (_this.settings.arrived) {
        _this.settings.arrived(elem(newRoute), newParams, routes);
      }
      if (routeById(newRoute).arrived) {
        routeById(newRoute).arrived(elem(newRoute), newParams, routes);
      }

      each.call(document.querySelectorAll('[aria-current]'), function (link) {
        link.removeAttribute('aria-current');
      });
      each.call(linksById(newRoute), function (link) {
        link.setAttribute('aria-current', 'true');
      });

      document.title = _this.title + ' ' + _this.settings.separator + ' ' + getLabel(routeById(newRoute));

      if (_this.settings.showHide && newRoute === focusId) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      var reroute = new CustomEvent('reroute', {
        detail: {
          newRoute: routeById(newRoute),
          oldRoute: routeById(oldRoute)
        }
      });
      window.dispatchEvent(reroute);
    };

    window.addEventListener('load', function (e) {
      routes.forEach(function (route) {
        var region = elem(route.id);
        region.setAttribute('role', 'region');
        region.setAttribute('aria-label', getLabel(route));
      });

      var hash = idByURL(url());

      if (!hash || !routeExists(hash)) {
        _this.reroute(defaultId);
      } else {
        reconfigure(routeExists(hash), null, null, hash);
      }
    });

    window.addEventListener('hashchange', function (e) {
      var id = idByURL(url());
      var newRoute = routeExists(id);
      var oldId = e.oldURL.indexOf('#') > -1 ? idByURL(e.oldURL) : null;
      var oldRoute = oldId ? routeExists(oldId) : null;

      if (newRoute && newRoute !== oldRoute) {
        var focusId = id === newRoute ? newRoute : id;
        reconfigure(newRoute, oldRoute, e.oldURL || null, focusId);
      }
    });
  }

  Xiao.prototype.reroute = function (id, params) {
    window.location.hash = (params || '') + id;
    return this;
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Xiao;
  } else {
    window.Xiao = Xiao;
  }
})(this);
