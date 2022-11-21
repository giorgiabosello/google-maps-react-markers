function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var propTypes = require('prop-types');
var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');

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

var useScript = function useScript(script) {
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
  var _useState = React.useState(script.src ? 'loading' : 'idle'),
    status = _useState[0],
    setStatus = _useState[1];
  React.useEffect(function () {
    var _script$callbacks, _script$callbacks2;
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
  },
  [script]);
  return status;
};

var useGoogleMaps = function useGoogleMaps(_ref) {
  var apiKey = _ref.apiKey,
    _ref$libraries = _ref.libraries,
    libraries = _ref$libraries === void 0 ? [] : _ref$libraries;
  var script = apiKey ? {
    src: "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=" + (libraries === null || libraries === void 0 ? void 0 : libraries.join(",")),
    attributes: {
      id: "googleMapsApi"
    }
  } : {
    src: "https://maps.googleapis.com/maps/api/js?libraries=" + (libraries === null || libraries === void 0 ? void 0 : libraries.join(",")),
    attributes: {
      id: "googleMapsApi"
    }
  };
  return useScript(script);
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
  container: propTypes.element.isRequired,
  pane: propTypes.string.isRequired,
  position: propTypes.shape({
    lat: propTypes.number.isRequired,
    lng: propTypes.number.isRequired
  }).isRequired,
  maps: propTypes.object.isRequired
};

var OverlayView = function OverlayView(_ref) {
  var position = _ref.position,
    _ref$pane = _ref.pane,
    pane = _ref$pane === void 0 ? 'floatPane' : _ref$pane,
    map = _ref.map,
    maps = _ref.maps,
    zIndex = _ref.zIndex,
    children = _ref.children;
  var container = React.useMemo(function () {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    return div;
  }, []);
  var overlay = React.useMemo(function () {
    return createOverlay({
      container: container,
      pane: pane,
      position: position,
      maps: maps
    });
  }, [container, maps, pane, position]);
  React.useEffect(function () {
    if (!overlay.map) {
      overlay === null || overlay === void 0 ? void 0 : overlay.setMap(map);
      return function () {
        overlay === null || overlay === void 0 ? void 0 : overlay.setMap(null);
      };
    }
  }, [map, children]);

  React.useEffect(function () {
    container.style.zIndex = "" + zIndex;
  }, [zIndex, container]);
  return /*#__PURE__*/reactDom.createPortal(children, container);
};

var MapMarkers = function MapMarkers(_ref) {
  var children = _ref.children,
    map = _ref.map,
    maps = _ref.maps;
  var markers = React.useMemo(function () {
    if (!map || !maps) return [];
    return React.Children.map(children, function (child) {
      if ( /*#__PURE__*/React.isValidElement(child)) {
        var latLng = {
          lat: child.props.lat,
          lng: child.props.lng
        };
        return /*#__PURE__*/React__default.createElement(OverlayView, {
          position: latLng,
          map: map,
          maps: maps
        }, child);
      }
    });
  }, [children, map, maps]);
  return /*#__PURE__*/React__default.createElement("div", null, markers);
};
MapMarkers.propTypes = {
  children: propTypes.node.isRequired,
  map: propTypes.object,
  maps: propTypes.object.isRequired
};

var _excluded = ["children", "style", "defaultCenter", "defaultZoom", "onGoogleApiLoaded", "onChange"];
var EPS = 0.00001;
var MapComponent = function MapComponent(_ref) {
  var children = _ref.children,
    style = _ref.style,
    defaultCenter = _ref.defaultCenter,
    defaultZoom = _ref.defaultZoom,
    onGoogleApiLoaded = _ref.onGoogleApiLoaded,
    onChange = _ref.onChange,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var mapRef = React.useRef(null);
  var prevBoundsRef = React.useRef(null);
  var _useState = React.useState(null),
    map = _useState[0],
    setMap = _useState[1];
  var _useState2 = React.useState(null),
    maps = _useState2[0],
    setMaps = _useState2[1];
  var _useState3 = React.useState(false),
    googleApiCalled = _useState3[0],
    setGoogleApiCalled = _useState3[1];
  var onIdle = React.useCallback(function () {
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
  }, [map, onChange]);
  React.useEffect(function () {
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, _extends({
        center: defaultCenter,
        zoom: defaultZoom
      }, props)));
      setMaps(window.google.maps);
    }
  }, [defaultCenter, defaultZoom, map, mapRef, props]);
  React.useEffect(function () {
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
  React.useEffect(function () {
    return function () {
      if (map) {
        window.google.maps.event.clearListeners(map, 'idle');
      }
    };
  }, [map]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: mapRef,
    style: style,
    className: "google-map"
  }), children && map && maps && /*#__PURE__*/React__default.createElement(MapMarkers, {
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
  onChange: function onChange() {}
};
MapComponent.propTypes = {
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]),
  style: propTypes.object,
  defaultCenter: propTypes.object.isRequired,
  defaultZoom: propTypes.number.isRequired,
  onGoogleApiLoaded: propTypes.func,
  onChange: propTypes.func
};

var _excluded$1 = ["apiKey", "libraries", "children", "loadingContent", "idleContent", "errorContent", "mapMinHeight", "containerProps"];
var GoogleMap = /*#__PURE__*/React.forwardRef(function GoogleMap(_ref, ref) {
  var apiKey = _ref.apiKey,
    libraries = _ref.libraries,
    children = _ref.children,
    loadingContent = _ref.loadingContent,
    idleContent = _ref.idleContent,
    errorContent = _ref.errorContent,
    mapMinHeight = _ref.mapMinHeight,
    containerProps = _ref.containerProps,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  var status = useGoogleMaps({
    apiKey: apiKey,
    libraries: libraries
  });
  return /*#__PURE__*/React__default.createElement("div", _extends({
    style: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      minHeight: mapMinHeight
    },
    ref: ref
  }, containerProps), status === 'ready' ? /*#__PURE__*/React__default.createElement(MapComponent, props, children) : status === 'loading' ? loadingContent : status === 'idle' ? idleContent : status === 'error' ? errorContent : null);
});
GoogleMap.defaultProps = _extends({}, MapComponent.defaultProps, {
  loadingContent: 'Google Maps is loading',
  idleContent: 'Google Maps is on idle',
  errorContent: 'Google Maps is on error',
  mapMinHeight: 'unset',
  apiKey: '',
  libraries: ['places', 'geometry']
});
GoogleMap.propTypes = _extends({}, MapComponent.propTypes, {
  children: propTypes.oneOfType([propTypes.node, propTypes.arrayOf(propTypes.node)]),
  loadingContent: propTypes.node,
  idleContent: propTypes.node,
  errorContent: propTypes.node,
  mapMinHeight: propTypes.oneOfType([propTypes.number, propTypes.string]),
  containerProps: propTypes.object
});

module.exports = GoogleMap;
//# sourceMappingURL=index.js.map
