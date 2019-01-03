// !version=0.1.23.112112
// !updated=["支持Dapp","交易功能稳定","优化加载速度","全新界面UI，全新体验","修复账户相关bug"]
// !appVersion=1.0.0

'use strict';
document.body.style.backgroundColor="#2F2F2F";
winit.path="/wallet/";//"/pi/0.1/";
winit.loadJS(winit.getLoadDomain("init.js"), 
	winit.path + 'app/boot/init.js?' + Math.random(), "utf8", winit.initFail, "load init error");

winit.loadJS(winit.getLoadDomain("next.js"), 
	winit.path + 'app/boot/next.js?' + Math.random(), "utf8", winit.initFail, "load next error");

winit.loadJS(winit.getLoadDomain("babel_polyfill.js"), 
	winit.path + "pi/polyfill/babel_polyfill.js", "utf8", winit.initFail, "load babel_polyfill error");

var dependFile = ".depend";
if (winit.httpDomains) {
	dependFile = "depend";
}
winit.loadJS(winit.getLoadDomain(dependFile), winit.path + dependFile + '?' + Math.random(), "utf8", winit.initFail, "load list error");

//winit.debug=false;