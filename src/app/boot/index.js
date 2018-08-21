//!version=1.81212311441133

'use strict';
document.body.style.backgroundColor="#2F2F2F";
winit.path="/wallet/";//"/pi/0.1/";
winit.loadJS(winit.domains, winit.path+'app/boot/init.js?'+Math.random(), "utf8", winit.initFail, "load init error");
winit.loadJS(winit.domains, winit.path+'app/boot/next.js?'+Math.random(), "utf8", winit.initFail, "load next error");
if(winit.isLoc){
    winit.loadJS([`http://${winit.severIp}:${winit.severPort}`,`http://${winit.severIp}:${winit.severPort}`], winit.path+'wallet/.depend?'+Math.random(), "utf8", winit.initFail, "load list error");
}else{
    winit.loadJS(winit.domains, winit.path+'.depend?'+Math.random(), "utf8", winit.initFail, "load list error");
}

winit.loadJS(winit.domains, winit.path+"pi/polyfill/babel_polyfill.js", "utf8", winit.initFail, "load babel_polyfill error");
winit.loadJS(winit.domains, winit.path+"app/boot/check.js?"+Math.random(), "utf8", winit.initFail, "load check.js error");
//winit.debug=false; 