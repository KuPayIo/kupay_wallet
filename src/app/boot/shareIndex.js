'use strict';
document.body.style.backgroundColor="#2F2F2F";
winit.path="/wallet/";//"/pi/0.1/";
winit.loadJS(winit.domains, winit.path+'app/boot/shareInit.js?'+Math.random(), "utf8", winit.initFail, "load init error");
winit.loadJS(winit.domains, winit.path+'app/boot/shareNext.js?'+Math.random(), "utf8", winit.initFail, "load next error");
winit.loadJS(winit.domains, winit.path+'.depend?'+Math.random(), "utf8", winit.initFail, "load list error");
winit.loadJS(winit.domains, winit.path+"pi/polyfill/babel_polyfill.js", "utf8", winit.initFail, "load babel_polyfill error");
//winit.debug=false; 