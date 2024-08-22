'use strict';

var react = require('react');
var reactDom = require('react-dom');
var jsxRuntime = require('react/jsx-runtime');

var S={};function W(t){let r=document.querySelector(`script[src="${t}"]`),a=r==null?void 0:r.getAttribute("data-status");return {node:r,status:a}}function Y(t={src:"",attributes:{},callbacks:{onLoadCallback:()=>{},onErrorCallback:()=>{}},elementIdToAppend:""},r,a={removeOnUnmount:!1,shouldPreventLoad:!1}){let[l,s]=react.useState(()=>!t.src||a!=null&&a.shouldPreventLoad?"idle":typeof window>"u"?"loading":S[t.src]??"loading");return react.useEffect(()=>{var p,n,m;if(r){s(r);return}if(!(t!=null&&t.src)||a!=null&&a.shouldPreventLoad)return;let i=S[t.src];if(i==="ready"||i==="error"){s(i);return}let u=W(t.src),e=u.node;if(e){let c=u.status??i??"loading";switch(c){case"loading":case"ready":(n=t.callbacks)!=null&&n.onLoadCallback&&t.callbacks.onLoadCallback();break;case"error":(m=t.callbacks)!=null&&m.onErrorCallback&&t.callbacks.onErrorCallback();break;}s(c);}else {e=document.createElement("script"),e.src=t.src,e.async=!0,e.setAttribute("data-status","loading"),t.attributes&&Object.entries(t.attributes).length>0&&Object.entries(t.attributes).map(([g,d])=>e==null?void 0:e.setAttribute(g,d)),t.elementIdToAppend&&document.getElementById(t.elementIdToAppend)?(p=document.getElementById(t.elementIdToAppend))==null||p.appendChild(e):document.body.appendChild(e);let c=g=>{let d=g.type==="load"?"ready":"error";e==null||e.setAttribute("data-status",d);};e.addEventListener("load",c),e.addEventListener("error",c);}let o=c=>{var d,M;let g=c.type==="load"?"ready":"error";c.type==="load"?(d=t.callbacks)!=null&&d.onLoadCallback&&t.callbacks.onLoadCallback():(M=t.callbacks)!=null&&M.onErrorCallback&&t.callbacks.onErrorCallback(),s(g),S[t.src]=g;};return e.addEventListener("load",o),e.addEventListener("error",o),()=>{e&&(e.removeEventListener("load",o),e.removeEventListener("error",o)),e&&(a!=null&&a.removeOnUnmount)&&e.remove();}},[t,r,l]),l}var H=Y;var O=({apiKey:t,libraries:r=[],loadScriptExternally:a=!1,status:l="idle",externalApiParams:s,callback:i})=>{var o;typeof window<"u"&&(window.googleMapsCallback=i);let u=(o=new URLSearchParams(s))==null?void 0:o.toString(),e=t?{src:`https://maps.googleapis.com/maps/api/js?key=${t}&callback=googleMapsCallback&libraries=${r==null?void 0:r.join(",")}${u?`&${u}`:""}`,attributes:{id:"googleMapsApi"}}:{src:`https://maps.googleapis.com/maps/api/js?callback=googleMapsCallback&libraries=${r==null?void 0:r.join(",")}`,attributes:{id:"googleMapsApi"}};return H(e,a?l:void 0)};var T=(t,r,a=1e-6)=>{if(t.length&&r.length){for(let l=0;l!==t.length;++l)if(Math.abs(t[l]-r[l])>a)return !1;return !0}return !1};var _=(t,r)=>{let a=react.useRef(),l=a.current,s=r(l,t);return react.useEffect(()=>{s||(a.current=t);}),s?l:t},x=_;var k=t=>{try{return {lat:t==null?void 0:t.lat(),lng:t==null?void 0:t.lng()}}catch{return t}},K=({container:t,pane:r,position:a,maps:l,drag:s})=>{class i extends google.maps.OverlayView{onAdd=()=>{var p;let e=this;s!=null&&s.draggable&&(this.get("map").getDiv().addEventListener("mouseleave",()=>{google.maps.event.trigger(this.container,"mouseup");}),this.container.addEventListener("mousedown",n=>{var m,c;this.container.style.cursor="grabbing",(m=e.map)==null||m.set("draggable",!1),e.set("origin",n),s.onDragStart(n,{latLng:k(this.position)}),e.moveHandler=(c=this.get("map"))==null?void 0:c.getDiv().addEventListener("mousemove",g=>{var b,f;let d=e.get("origin");if(!d)return;let M=d.clientX-g.clientX,y=d.clientY-g.clientY,v=(b=e.getProjection())==null?void 0:b.fromLatLngToDivPixel(e.position);if(!v)return;let E=(f=e.getProjection())==null?void 0:f.fromDivPixelToLatLng(new l.Point(v.x-M,v.y-y));e.set("position",E),e.set("origin",g),e.draw(),s.onDrag(g,{latLng:k(E)});});}),this.container.addEventListener("mouseup",n=>{var m;(m=e.map)==null||m.set("draggable",!0),this.container.style.cursor="default",e.moveHandler&&(google.maps.event.removeListener(e.moveHandler),e.moveHandler=null),e.set("position",e.position),e.set("origin",void 0),e.draw(),s.onDragEnd(n,{latLng:k(e.position)});}));let o=(p=this.getPanes())==null?void 0:p[this.pane];o==null||o.classList.add("google-map-markers-overlay"),o==null||o.appendChild(this.container);};draw=()=>{let e=this.getProjection(),o=e==null?void 0:e.fromLatLngToDivPixel(this.position),p={x:this.container.offsetWidth/2,y:this.container.offsetHeight/2};o&&(this.container.style.left=`${o.x-p.x}px`,this.container.style.top=`${o.y-p.y}px`);};onRemove=()=>{this.container.parentNode!==null&&(google.maps.event.clearInstanceListeners(this.container),this.container.parentNode.removeChild(this.container));};container;pane;position;map=this.getMap();moveHandler;constructor(e,o,p){super(),this.container=e,this.pane=o,this.position=p,this.moveHandler=null;}}return new i(t,r,a)},U=K;var ee=({pane:t="floatPane",position:r,map:a,maps:l,zIndex:s=0,children:i,drag:u})=>{let e=react.useMemo(()=>{let n=document.createElement("div");return n.style.position="absolute",n},[]),o=react.useMemo(()=>U({container:e,pane:t,position:r,maps:l,drag:u}),[e,u,l,t,r]),p=x(i==null?void 0:i.props,(n,m)=>n&&n.lat===m.lat&&n.lng===m.lng);return react.useEffect(()=>!o.map&&a?(o==null||o.setMap(a),()=>{o==null||o.setMap(null);}):()=>{},[a,p]),react.useEffect(()=>{e.style.zIndex=`${s}`;},[s,e]),reactDom.createPortal(i,e)},R=ee;var P=()=>{},ae=({children:t,map:r,maps:a})=>{let l=react.useMemo(()=>!r||!a?[]:react.Children.map(t,s=>{if(react.isValidElement(s)){let i={lat:s.props.lat,lng:s.props.lng},{zIndex:u,draggable:e=!1,onDragStart:o=P,onDrag:p=P,onDragEnd:n=P}=s.props||{};return s=react.cloneElement(s,{...s.props,onDragStart:void 0,onDrag:void 0,onDragEnd:void 0}),jsxRuntime.jsx(R,{position:new a.LatLng(i.lat,i.lng),map:r,maps:a,zIndex:u,drag:{draggable:e,onDragStart:o,onDrag:p,onDragEnd:n},children:s})}return null}),[t,r,a]);return jsxRuntime.jsx("div",{children:l})},$=ae;function le({children:t=null,style:r={width:"100%",height:"100%",left:0,top:0,margin:0,padding:0,position:"absolute"},defaultCenter:a,defaultZoom:l,onGoogleApiLoaded:s,onChange:i,options:u={},events:e=[]}){let o=react.useRef(null),p=react.useRef([]),[n,m]=react.useState(),[c,g]=react.useState(),[d,M]=react.useState(!1),y=react.useCallback(()=>{var v,E;try{if(!n)return;let b=n.getZoom()??l,f=n.getBounds(),F=[(v=n.getCenter())==null?void 0:v.lng(),(E=n.getCenter())==null?void 0:E.lat()],h=f==null?void 0:f.getNorthEast(),L=f==null?void 0:f.getSouthWest();if(!h||!L||!f)return;let D=[L.lng(),L.lat(),h.lng(),h.lat()];T(D,p.current)||(i&&i({zoom:b,center:F,bounds:f}),p.current=D);}catch(b){console.error(b);}},[n,i]);return react.useEffect(()=>{o.current&&!n&&(m(new google.maps.Map(o.current,{center:a,zoom:l,...u})),g(google.maps));},[a,l,n,o,u]),react.useEffect(()=>{n&&!d&&(typeof s=="function"&&c&&s({map:n,maps:c,ref:o.current}),M(!0),google.maps.event.hasListeners(n,"idle")&&google.maps.event.clearListeners(n,"idle"),google.maps.event.addListener(n,"idle",y));},[d,n,s]),react.useEffect(()=>()=>{n&&google.maps.event.clearListeners(n,"idle");},[n]),jsxRuntime.jsxs(jsxRuntime.Fragment,{children:[jsxRuntime.jsx("div",{ref:o,style:r,className:"google-map",...e==null?void 0:e.reduce((v,{name:E,handler:b})=>(v[E]=b,v),{})}),t&&n&&c&&jsxRuntime.jsx($,{map:n,maps:c,children:t})]})}var q=le;var ue=react.forwardRef(({apiKey:t="",libraries:r=["places","geometry"],children:a=null,loadingContent:l="Google Maps is loading",idleContent:s="Google Maps is on idle",errorContent:i="Google Maps is on error",mapMinHeight:u="unset",containerProps:e={},loadScriptExternally:o=!1,status:p="idle",scriptCallback:n=()=>{},externalApiParams:m={},...c},g)=>{let d={ready:jsxRuntime.jsx(q,{...c,children:a}),loading:l,idle:s,error:i},M=O({apiKey:t,libraries:r,loadScriptExternally:o,status:p,externalApiParams:m,callback:n});return jsxRuntime.jsx("div",{ref:g,style:{height:"100%",width:"100%",overflow:"hidden",position:"relative",minHeight:u},...e,children:d[M]||null})}),B=ue;var qe=B;

module.exports = qe;
