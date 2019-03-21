//!version=1.0.12.100917
//!android_depend_version=1.0.0
//!ios_depend_version=3.0.0

/**
 * 以上三个版本的意义如下：
 * 
 * version的值表示：H5的版本号，主版本.次版本.补丁版本.修改日期。
 *    + 主版本和次版本变动，强制更新H5；
 *    + 补丁版本变动，提示更新H5，由用户决定是否更新；
 *    + 在构建上做了个功能：只要有文件变动，由pi_build自动修改次版本号
 *       * 要启用这个功能，需要在.conf中添加lisnter：set_version
 * android_depend_version的值表示：该H5更新需要的最低Android APP的版本号。
 *    + 只有在Android App的版本达到这个以上，才会更新H5版本；
 * ios_depend_version的值表示：该H5更新需要的最低iOS APP的版本号。
 *    + 只有在Android App的版本达到这个以上，才会更新H5版本；
 */


'use strict';
document.body.style.backgroundColor="#2F2F2F";
winit.path="/wallet/";//"/pi/0.1/";
winit.loadJS(winit.getLoadDomain("init.js"), 
	winit.path + 'pi/boot/init.js?' + Math.random(), "utf8", winit.initFail, "load init error");

winit.loadJS(winit.getLoadDomain("next.js"), 
	winit.path + 'app/boot/next.js?' + Math.random(), "utf8", winit.initFail, "load next error");

winit.loadJS(winit.getLoadDomain("babel_polyfill.js"), 
	winit.path + "pi/polyfill/babel_polyfill.js", "utf8", winit.initFail, "load babel_polyfill error");

// 现在没拦截了，所以需要改成depend
var dependFile = ".depend";
if (winit.httpDomains) {
	dependFile = "depend";
}
winit.loadJS(winit.getLoadDomain(dependFile), winit.path + dependFile + '?' + Math.random(), "utf8", winit.initFail, "load list error");

//winit.debug=false;
