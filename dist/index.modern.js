import { element, string, shape, number, object, node, oneOfType, arrayOf, func, bool, oneOf } from 'prop-types';
import React, { useState, useEffect, useRef, useMemo, Children, isValidElement, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

var useScript = function useScript(script, forcedStatus) {
  if (script === void 0) {
    script = {
      src: '',
      attributes: {},
      callbacks: {
        onLoadCallback: null,
        onErrorCallback: null
      },
      elementIdToAppend: null
    };
  }
  if (forcedStatus === void 0) {
    forcedStatus = undefined;
  }
  var _useState = useState(script.src ? 'loading' : 'idle'),
    status = _useState[0],
    setStatus = _useState[1];
  useEffect(function () {
    var _script$callbacks, _script$callbacks2;
    if (forcedStatus) {
      setStatus(forcedStatus);
      return function () {};
    }
    if (!script.src) {
      setStatus('idle');
      return;
    }
    var scriptToAdd = document.querySelector("script[src=\"" + script.src + "\"]");
    if (!scriptToAdd) {
      scriptToAdd = document.createElement('script');
      scriptToAdd.src = script.src;
      scriptToAdd.async = true;
      scriptToAdd.setAttribute('data-status', 'loading');
      script.attributes && Object.entries(script.attributes).length > 0 ? Object.entries(script.attributes).map(function (_ref) {
        var key = _ref[0],
          value = _ref[1];
        return scriptToAdd.setAttribute(key, value);
      }) : null;
      if (script.elementIdToAppend && document.getElementById(script.elementIdToAppend)) {
        document.getElementById(script.elementIdToAppend).appendChild(scriptToAdd);
      } else {
        document.body.appendChild(scriptToAdd);
      }
      var setAttributeFromEvent = function setAttributeFromEvent(event) {
        scriptToAdd.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
      };
      scriptToAdd.addEventListener('load', setAttributeFromEvent);
      scriptToAdd.addEventListener('error', setAttributeFromEvent);
    } else {
      var currentScriptStatus = scriptToAdd.getAttribute('data-status');
      switch (currentScriptStatus) {
        case 'load':
        case 'ready':
          (_script$callbacks = script.callbacks) !== null && _script$callbacks !== void 0 && _script$callbacks.onLoadCallback ? script.callbacks.onLoadCallback() : null;
          break;
        case 'error':
          (_script$callbacks2 = script.callbacks) !== null && _script$callbacks2 !== void 0 && _script$callbacks2.onErrorCallback ? script.callbacks.onErrorCallback() : null;
          break;
      }
      setStatus(currentScriptStatus);
    }
    var setStateFromEvent = function setStateFromEvent(event) {
      var _script$callbacks3, _script$callbacks4;
      event.type === 'load' ? (_script$callbacks3 = script.callbacks) !== null && _script$callbacks3 !== void 0 && _script$callbacks3.onLoadCallback ? script.callbacks.onLoadCallback() : null : (_script$callbacks4 = script.callbacks) !== null && _script$callbacks4 !== void 0 && _script$callbacks4.onErrorCallback ? script.callbacks.onErrorCallback() : null;
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };
    scriptToAdd.addEventListener('load', setStateFromEvent);
    scriptToAdd.addEventListener('error', setStateFromEvent);
    return function () {
      if (scriptToAdd) {
        scriptToAdd.removeEventListener('load', setStateFromEvent);
        scriptToAdd.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [script, forcedStatus, status]);
  return status;
};

var useGoogleMaps = function useGoogleMaps(_ref) {
  var apiKey = _ref.apiKey,
    _ref$libraries = _ref.libraries,
    libraries = _ref$libraries === void 0 ? [] : _ref$libraries,
    _ref$loadScriptExtern = _ref.loadScriptExternally,
    loadScriptExternally = _ref$loadScriptExtern === void 0 ? false : _ref$loadScriptExtern,
    _ref$status = _ref.status,
    status = _ref$status === void 0 ? 'idle' : _ref$status,
    callback = _ref.callback;
  if (typeof window !== 'undefined') window.googleMapsCallback = callback;
  var script = apiKey ? {
    src: "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=googleMapsCallback&libraries=" + (libraries === null || libraries === void 0 ? void 0 : libraries.join(',')),
    attributes: {
      id: 'googleMapsApi'
    }
  } : {
    src: "https://maps.googleapis.com/maps/api/js?callback=googleMapsCallback&libraries=" + (libraries === null || libraries === void 0 ? void 0 : libraries.join(',')),
    attributes: {
      id: 'googleMapsApi'
    }
  };
  return useScript(script, loadScriptExternally ? status : undefined);
};

var isArraysEqualEps = function isArraysEqualEps(arrayA, arrayB, eps) {
  if (arrayA && arrayB) {
    for (var i = 0; i !== arrayA.length; ++i) {
      if (Math.abs(arrayA[i] - arrayB[i]) > eps) {
        return false;
      }
    }
    return true;
  }
  return false;
};

var useMemoCompare = function useMemoCompare(next, compare) {
  var previousRef = useRef();
  var previous = previousRef.current;
  var isEqual = compare(previous, next);
  useEffect(function () {
    if (!isEqual) {
      previousRef.current = next;
    }
  });
  return isEqual ? previous : next;
};

var createOverlay = function createOverlay(_ref) {
  var container = _ref.container,
    pane = _ref.pane,
    position = _ref.position,
    maps = _ref.maps;
  var Overlay = /*#__PURE__*/function (_maps$OverlayView) {
    _inheritsLoose(Overlay, _maps$OverlayView);
    function Overlay(container, _pane, position) {
      var _this;
      _this = _maps$OverlayView.call(this) || this;
      _this.onAdd = function () {
        var pane = _this.getPanes()[_this.pane];
        pane === null || pane === void 0 ? void 0 : pane.classList.add('google-map-markers-overlay');
        pane === null || pane === void 0 ? void 0 : pane.appendChild(_this.container);
      };
      _this.draw = function () {
        var projection = _this.getProjection();
        var point = projection.fromLatLngToDivPixel(_this.position);
        if (point === null) return;
        _this.container.style.transform = "translate(" + point.x + "px, " + point.y + "px)";
      };
      _this.onRemove = function () {
        if (_this.container.parentNode !== null) {
          _this.container.parentNode.removeChild(_this.container);
        }
      };
      _this.container = container;
      _this.pane = _pane;
      _this.position = position;
      return _this;
    }
    return Overlay;
  }(maps.OverlayView);
  return new Overlay(container, pane, position);
};
createOverlay.propTypes = {
  container: element.isRequired,
  pane: string.isRequired,
  position: shape({
    lat: number.isRequired,
    lng: number.isRequired
  }).isRequired,
  maps: object.isRequired
};

var OverlayView = function OverlayView(_ref) {
  var position = _ref.position,
    _ref$pane = _ref.pane,
    pane = _ref$pane === void 0 ? 'floatPane' : _ref$pane,
    map = _ref.map,
    maps = _ref.maps,
    zIndex = _ref.zIndex,
    children = _ref.children;
  var container = useMemo(function () {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    return div;
  }, []);
  var overlay = useMemo(function () {
    return createOverlay({
      container: container,
      pane: pane,
      position: position,
      maps: maps
    });
  }, [container, maps, pane, position]);
  var childrenProps = useMemoCompare(children === null || children === void 0 ? void 0 : children.props, function (prev, next) {
    return prev && prev.lat === next.lat && prev.lng === next.lng;
  });
  useEffect(function () {
    if (!overlay.map) {
      overlay === null || overlay === void 0 ? void 0 : overlay.setMap(map);
      return function () {
        overlay === null || overlay === void 0 ? void 0 : overlay.setMap(null);
      };
    }
  }, [map, childrenProps]);
  useEffect(function () {
    container.style.zIndex = "" + zIndex;
  }, [zIndex, container]);
  return /*#__PURE__*/createPortal(children, container);
};
OverlayView.defaultProps = {
  zIndex: 0
};
OverlayView.propTypes = {
  pane: string,
  position: shape({
    lat: number.isRequired,
    lng: number.isRequired
  }).isRequired,
  map: object.isRequired,
  maps: object.isRequired,
  zIndex: number,
  children: node.isRequired
};

var MapMarkers = function MapMarkers(_ref) {
  var children = _ref.children,
    map = _ref.map,
    maps = _ref.maps;
  var markers = useMemo(function () {
    if (!map || !maps) return [];
    return Children.map(children, function (child) {
      if ( /*#__PURE__*/isValidElement(child)) {
        var latLng = {
          lat: child.props.lat,
          lng: child.props.lng
        };
        var zIndex = child.props.zIndex || undefined;
        return /*#__PURE__*/React.createElement(OverlayView, {
          position: latLng,
          map: map,
          maps: maps,
          zIndex: zIndex
        }, child);
      }
    });
  }, [children, map, maps]);
  return /*#__PURE__*/React.createElement("div", null, markers);
};
MapMarkers.propTypes = {
  children: node.isRequired,
  map: object,
  maps: object.isRequired
};

var EPS = 0.00001;
var MapComponent = function MapComponent(_ref) {
  var children = _ref.children,
    style = _ref.style,
    defaultCenter = _ref.defaultCenter,
    defaultZoom = _ref.defaultZoom,
    onGoogleApiLoaded = _ref.onGoogleApiLoaded,
    onChange = _ref.onChange,
    options = _ref.options,
    events = _ref.events;
  var mapRef = useRef(null);
  var prevBoundsRef = useRef(null);
  var _useState = useState(null),
    map = _useState[0],
    setMap = _useState[1];
  var _useState2 = useState(null),
    maps = _useState2[0],
    setMaps = _useState2[1];
  var _useState3 = useState(false),
    googleApiCalled = _useState3[0],
    setGoogleApiCalled = _useState3[1];
  var onIdle = useCallback(function () {
    try {
      var zoom = map.getZoom();
      var bounds = map.getBounds();
      var centerLatLng = map.getCenter();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var boundsArray = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
      if (!isArraysEqualEps(boundsArray, prevBoundsRef.current, EPS)) {
        if (onChange) {
          onChange({
            zoom: zoom,
            center: [centerLatLng.lng(), centerLatLng.lat()],
            bounds: bounds
          });
        }
        prevBoundsRef.current = boundsArray;
      }
    } catch (e) {
      console.error(e);
    }
  }, [map, onChange]);
  useEffect(function () {
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, _extends({
        center: defaultCenter,
        zoom: defaultZoom
      }, options)));
      setMaps(window.google.maps);
    }
  }, [defaultCenter, defaultZoom, map, mapRef, options]);
  useEffect(function () {
    if (map) {
      if (!googleApiCalled) {
        onGoogleApiLoaded({
          map: map,
          maps: maps,
          ref: mapRef.current
        });
        setGoogleApiCalled(true);
      }
      window.google.maps.event.clearListeners(map, 'idle');
      window.google.maps.event.addListener(map, 'idle', onIdle);
    }
  }, [googleApiCalled, map, maps, onChange, onGoogleApiLoaded, onIdle]);
  useEffect(function () {
    return function () {
      if (map) {
        window.google.maps.event.clearListeners(map, 'idle');
      }
    };
  }, [map]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", _extends({
    ref: mapRef,
    style: style,
    className: "google-map"
  }, events === null || events === void 0 ? void 0 : events.reduce(function (acc, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
      name = _ref2.name,
      handler = _ref2.handler;
    acc[name] = handler;
    return acc;
  }, {}))), children && map && maps && /*#__PURE__*/React.createElement(MapMarkers, {
    map: map,
    maps: maps
  }, children));
};
MapComponent.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    margin: 0,
    padding: 0,
    position: 'absolute'
  },
  onGoogleApiLoaded: function onGoogleApiLoaded() {},
  onChange: function onChange() {},
  options: {},
  events: []
};
MapComponent.propTypes = {
  children: oneOfType([arrayOf(node), node]),
  style: object,
  defaultCenter: object.isRequired,
  defaultZoom: number.isRequired,
  onGoogleApiLoaded: func,
  onChange: func,
  options: object,
  events: arrayOf(shape({
    name: string.isRequired,
    handler: func.isRequired
  }))
};

var _excluded = ["apiKey", "libraries", "children", "loadingContent", "idleContent", "errorContent", "mapMinHeight", "containerProps", "loadScriptExternally", "status", "scriptCallback"];
var GoogleMap = /*#__PURE__*/forwardRef(function GoogleMap(_ref, ref) {
  var apiKey = _ref.apiKey,
    libraries = _ref.libraries,
    children = _ref.children,
    loadingContent = _ref.loadingContent,
    idleContent = _ref.idleContent,
    errorContent = _ref.errorContent,
    mapMinHeight = _ref.mapMinHeight,
    containerProps = _ref.containerProps,
    loadScriptExternally = _ref.loadScriptExternally,
    status = _ref.status,
    scriptCallback = _ref.scriptCallback,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var renderers = {
    ready: /*#__PURE__*/React.createElement(MapComponent, props, children),
    loading: loadingContent,
    idle: idleContent,
    error: errorContent
  };
  var _status = useGoogleMaps({
    apiKey: apiKey,
    libraries: libraries,
    loadScriptExternally: loadScriptExternally,
    status: status,
    callback: scriptCallback
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      minHeight: mapMinHeight
    },
    ref: ref
  }, containerProps), renderers[_status] || null);
});
GoogleMap.defaultProps = _extends({}, MapComponent.defaultProps, {
  loadingContent: 'Google Maps is loading',
  idleContent: 'Google Maps is on idle',
  errorContent: 'Google Maps is on error',
  mapMinHeight: 'unset',
  apiKey: '',
  libraries: ['places', 'geometry'],
  loadScriptExternally: false,
  status: 'idle',
  scriptCallback: function scriptCallback() {}
});
GoogleMap.propTypes = _extends({}, MapComponent.propTypes, {
  children: oneOfType([node, arrayOf(node)]),
  loadingContent: node,
  idleContent: node,
  errorContent: node,
  mapMinHeight: oneOfType([number, string]),
  containerProps: object,
  loadScriptExternally: bool,
  status: oneOf(['idle', 'loading', 'ready', 'error']),
  scriptCallback: func
});

export default GoogleMap;
//# sourceMappingURL=index.modern.js.map
