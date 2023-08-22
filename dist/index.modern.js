import { element, string, shape, number, object, bool, func, node, oneOfType, arrayOf, oneOf } from 'prop-types';
import React, { useState, useEffect, useRef, useMemo, Children, isValidElement, cloneElement, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';

const useScript = (script = {
  src: '',
  attributes: {},
  callbacks: {
    onLoadCallback: null,
    onErrorCallback: null
  },
  elementIdToAppend: null
}, forcedStatus = undefined) => {
  const [status, setStatus] = useState(script.src ? 'loading' : 'idle');
  useEffect(() => {
    var _script$callbacks, _script$callbacks2;
    if (forcedStatus) {
      setStatus(forcedStatus);
      return () => {};
    }
    if (!script.src) {
      setStatus('idle');
      return;
    }
    let scriptToAdd = document.querySelector(`script[src="${script.src}"]`);
    if (!scriptToAdd) {
      scriptToAdd = document.createElement('script');
      scriptToAdd.src = script.src;
      scriptToAdd.async = true;
      scriptToAdd.setAttribute('data-status', 'loading');
      script.attributes && Object.entries(script.attributes).length > 0 ? Object.entries(script.attributes).map(([key, value]) => scriptToAdd.setAttribute(key, value)) : null;
      if (script.elementIdToAppend && document.getElementById(script.elementIdToAppend)) {
        document.getElementById(script.elementIdToAppend).appendChild(scriptToAdd);
      } else {
        document.body.appendChild(scriptToAdd);
      }
      const setAttributeFromEvent = event => {
        scriptToAdd.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
      };
      scriptToAdd.addEventListener('load', setAttributeFromEvent);
      scriptToAdd.addEventListener('error', setAttributeFromEvent);
    } else {
      const currentScriptStatus = scriptToAdd.getAttribute('data-status');
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
    const setStateFromEvent = event => {
      var _script$callbacks3, _script$callbacks4;
      event.type === 'load' ? (_script$callbacks3 = script.callbacks) !== null && _script$callbacks3 !== void 0 && _script$callbacks3.onLoadCallback ? script.callbacks.onLoadCallback() : null : (_script$callbacks4 = script.callbacks) !== null && _script$callbacks4 !== void 0 && _script$callbacks4.onErrorCallback ? script.callbacks.onErrorCallback() : null;
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };
    scriptToAdd.addEventListener('load', setStateFromEvent);
    scriptToAdd.addEventListener('error', setStateFromEvent);
    return () => {
      if (scriptToAdd) {
        scriptToAdd.removeEventListener('load', setStateFromEvent);
        scriptToAdd.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [script, forcedStatus, status]);
  return status;
};

const useGoogleMaps = ({
  apiKey,
  libraries: _libraries = [],
  loadScriptExternally: _loadScriptExternally = false,
  status: _status = 'idle',
  externalApiParams,
  callback
}) => {
  var _URLSearchParams;
  if (typeof window !== 'undefined') window.googleMapsCallback = callback;
  const apiParams = (_URLSearchParams = new URLSearchParams(externalApiParams)) === null || _URLSearchParams === void 0 ? void 0 : _URLSearchParams.toString();
  const script = apiKey ? {
    src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=googleMapsCallback&libraries=${_libraries === null || _libraries === void 0 ? void 0 : _libraries.join(',')}${apiParams ? '&' + apiParams : ''}`,
    attributes: {
      id: 'googleMapsApi'
    }
  } : {
    src: `https://maps.googleapis.com/maps/api/js?callback=googleMapsCallback&libraries=${_libraries === null || _libraries === void 0 ? void 0 : _libraries.join(',')}`,
    attributes: {
      id: 'googleMapsApi'
    }
  };
  return useScript(script, _loadScriptExternally ? _status : undefined);
};

const isArraysEqualEps = (arrayA, arrayB, eps) => {
  if (arrayA && arrayB) {
    for (let i = 0; i !== arrayA.length; ++i) {
      if (Math.abs(arrayA[i] - arrayB[i]) > eps) {
        return false;
      }
    }
    return true;
  }
  return false;
};

const useMemoCompare = (next, compare) => {
  const previousRef = useRef();
  const previous = previousRef.current;
  const isEqual = compare(previous, next);
  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });
  return isEqual ? previous : next;
};

const getLatLng = LatLng => {
  try {
    const latLng = {
      lat: LatLng.lat(),
      lng: LatLng.lng()
    };
    return latLng;
  } catch (e) {
    return LatLng;
  }
};
const createOverlay = ({
  container,
  pane,
  position,
  maps,
  drag
}) => {
  class Overlay extends maps.OverlayView {
    constructor(_container, _pane, position) {
      super();
      this.onAdd = () => {
        let that = this;
        if (drag !== null && drag !== void 0 && drag.draggable) {
          maps.event.addDomListener(this.get('map').getDiv(), 'mouseleave', () => {
            maps.event.trigger(container, 'mouseup');
          });
          maps.event.addDomListener(this.container, 'mousedown', e => {
            this.container.style.cursor = 'grabbing';
            that.map.set('draggable', false);
            that.set('origin', e);
            drag.onDragStart(e, {
              latLng: getLatLng(this.position)
            });
            that.moveHandler = maps.event.addDomListener(this.get('map').getDiv(), 'mousemove', e => {
              let origin = that.get('origin'),
                left = origin.clientX - e.clientX,
                top = origin.clientY - e.clientY,
                pos = that.getProjection().fromLatLngToDivPixel(that.position),
                latLng = that.getProjection().fromDivPixelToLatLng(new maps.Point(pos.x - left, pos.y - top));
              that.set('position', latLng);
              that.set('origin', e);
              that.draw();
              drag.onDrag(e, {
                latLng: getLatLng(latLng)
              });
            });
          });
          maps.event.addDomListener(container, 'mouseup', e => {
            that.map.set('draggable', true);
            this.container.style.cursor = 'default';
            maps.event.removeListener(that.moveHandler);
            drag.onDragEnd(e, {
              latLng: getLatLng(that.position)
            });
          });
        }
        const pane = this.getPanes()[this.pane];
        pane === null || pane === void 0 ? void 0 : pane.classList.add('google-map-markers-overlay');
        pane === null || pane === void 0 ? void 0 : pane.appendChild(this.container);
      };
      this.draw = () => {
        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(this.position);
        if (point === null) return;
        this.container.style.transform = `translate(${point.x}px, ${point.y}px)`;
        this.container.style.width = '0px';
        this.container.style.height = '0px';
      };
      this.onRemove = () => {
        if (this.container.parentNode !== null) {
          maps.event.clearInstanceListeners(this.container);
          this.container.parentNode.removeChild(this.container);
        }
      };
      this.container = _container;
      this.pane = _pane;
      this.position = position;
    }
  }
  return new Overlay(container, pane, position);
};
createOverlay.propTypes = {
  container: element.isRequired,
  pane: string.isRequired,
  position: shape({
    lat: number.isRequired,
    lng: number.isRequired
  }).isRequired,
  maps: object.isRequired,
  drag: shape({
    draggable: bool,
    onDragStart: func,
    onDrag: func,
    onDragEnd: func
  })
};

const OverlayView = ({
  pane,
  position,
  map,
  maps,
  zIndex,
  children,
  drag
}) => {
  const container = useMemo(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    return div;
  }, []);
  const overlay = useMemo(() => {
    return createOverlay({
      container,
      pane,
      position,
      maps,
      drag
    });
  }, [container, maps, pane, position]);
  const childrenProps = useMemoCompare(children === null || children === void 0 ? void 0 : children.props, (prev, next) => {
    return prev && prev.lat === next.lat && prev.lng === next.lng;
  });
  useEffect(() => {
    if (!overlay.map) {
      overlay === null || overlay === void 0 ? void 0 : overlay.setMap(map);
      return () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.setMap(null);
      };
    }
  }, [map, childrenProps]);
  useEffect(() => {
    container.style.zIndex = `${zIndex}`;
  }, [zIndex, container]);
  return /*#__PURE__*/createPortal(children, container);
};
OverlayView.defaultProps = {
  pane: 'floatPane',
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
  children: node.isRequired,
  drag: shape({
    draggable: bool,
    onDragStart: func,
    onDrag: func,
    onDragEnd: func
  })
};

const noop = () => {};
const MapMarkers = ({
  children,
  map,
  maps
}) => {
  const markers = useMemo(() => {
    if (!map || !maps) return [];
    return Children.map(children, child => {
      if ( /*#__PURE__*/isValidElement(child)) {
        const latLng = {
          lat: child.props.lat,
          lng: child.props.lng
        };
        const {
          zIndex,
          draggable = false,
          onDragStart = noop,
          onDrag = noop,
          onDragEnd = noop
        } = child.props || {};
        child = /*#__PURE__*/cloneElement(child, {
          ...child.props,
          draggable: undefined,
          onDragStart: undefined,
          onDrag: undefined,
          onDragEnd: undefined
        });
        return /*#__PURE__*/React.createElement(OverlayView, {
          position: latLng,
          map: map,
          maps: maps,
          zIndex: zIndex,
          drag: {
            draggable,
            onDragStart,
            onDrag,
            onDragEnd
          }
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

const EPS = 0.00001;
const MapComponent = ({
  children,
  style,
  defaultCenter,
  defaultZoom,
  onGoogleApiLoaded,
  onChange,
  options,
  events
}) => {
  const mapRef = useRef(null);
  const prevBoundsRef = useRef(null);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [googleApiCalled, setGoogleApiCalled] = useState(false);
  const onIdle = useCallback(() => {
    try {
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      const centerLatLng = map.getCenter();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const boundsArray = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
      if (!isArraysEqualEps(boundsArray, prevBoundsRef.current, EPS)) {
        if (onChange) {
          onChange({
            zoom,
            center: [centerLatLng.lng(), centerLatLng.lat()],
            bounds
          });
        }
        prevBoundsRef.current = boundsArray;
      }
    } catch (e) {
      console.error(e);
    }
  }, [map, onChange]);
  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        ...options
      }));
      setMaps(window.google.maps);
    }
  }, [defaultCenter, defaultZoom, map, mapRef, options]);
  useEffect(() => {
    if (map) {
      if (!googleApiCalled) {
        onGoogleApiLoaded({
          map,
          maps,
          ref: mapRef.current
        });
        setGoogleApiCalled(true);
      }
      window.google.maps.event.clearListeners(map, 'idle');
      window.google.maps.event.addListener(map, 'idle', onIdle);
    }
  }, [googleApiCalled, map, maps, onChange, onGoogleApiLoaded, onIdle]);
  useEffect(() => {
    return () => {
      if (map) {
        window.google.maps.event.clearListeners(map, 'idle');
      }
    };
  }, [map]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", Object.assign({
    ref: mapRef,
    style: style,
    className: "google-map"
  }, events === null || events === void 0 ? void 0 : events.reduce((acc, {
    name,
    handler
  } = {}) => {
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
  onGoogleApiLoaded: () => {},
  onChange: () => {},
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

const GoogleMap = /*#__PURE__*/forwardRef(function GoogleMap({
  apiKey,
  libraries,
  children,
  loadingContent,
  idleContent,
  errorContent,
  mapMinHeight,
  containerProps,
  loadScriptExternally,
  status,
  scriptCallback,
  externalApiParams,
  ...props
}, ref) {
  const renderers = {
    ready: /*#__PURE__*/React.createElement(MapComponent, props, children),
    loading: loadingContent,
    idle: idleContent,
    error: errorContent
  };
  const _status = useGoogleMaps({
    apiKey,
    libraries,
    loadScriptExternally,
    status,
    externalApiParams,
    callback: scriptCallback
  });
  return /*#__PURE__*/React.createElement("div", Object.assign({
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
GoogleMap.defaultProps = {
  ...MapComponent.defaultProps,
  loadingContent: 'Google Maps is loading',
  idleContent: 'Google Maps is on idle',
  errorContent: 'Google Maps is on error',
  mapMinHeight: 'unset',
  apiKey: '',
  libraries: ['places', 'geometry'],
  loadScriptExternally: false,
  status: 'idle',
  scriptCallback: () => {}
};
GoogleMap.propTypes = {
  ...MapComponent.propTypes,
  children: oneOfType([node, arrayOf(node)]),
  loadingContent: node,
  idleContent: node,
  errorContent: node,
  mapMinHeight: oneOfType([number, string]),
  containerProps: object,
  loadScriptExternally: bool,
  status: oneOf(['idle', 'loading', 'ready', 'error']),
  scriptCallback: func,
  externalApiParams: object
};

export default GoogleMap;
//# sourceMappingURL=index.modern.js.map
