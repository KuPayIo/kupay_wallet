"use strict";
// 依赖表加载成功后的回调函数
winit.initNext = function () {
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;

	win.Map = 1;
	var flags = winit.flags;

	// console.log("init time:", Date.now() - startTime);
	// 清除运营商注入的代码
	var clear = function () {
		//清除window上新增的对象
		var k;
		for (k in window) {
			if (window.hasOwnProperty(k) && !win[k]) window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i,
			arr = document.body.children;
		for (i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if (!k.getAttribute("pi")) document.body.removeChild(k);
		}
	};
	//clear();

	pi_modules.depend.exports.init(winit.deps, winit.path);

	winit = undefined; //一定要立即释放，保证不会重复执行
	//先登录

	//二级页面相关的图片和代码资源
	TIME_STR += "before load time: " + (Date.now() - PRE_TIME);
	PRE_TIME = Date.now();
	var div = document.createElement('div');
	div.setAttribute("id", "pi")
	div.setAttribute("pi", "1");
	div.setAttribute("class", "process");
	// div.setAttribute("style", "position:absolute;bottom:10px;left: 2%;width: 95%;height: 10px;background: #262626;padding: 1px;border-radius: 20px;border-top: 1px solid #000;border-bottom: 1px solid #7992a8;z-index:9999;");
	var divProcess = document.createElement('div');
	var divProcessBg = document.createElement('div');
	var divProcessIcon = document.createElement('div');
	divProcess.setAttribute("style", "width: 0%;height: 100%;border-radius: 20px;position:relative");
	// divProcessBg.setAttribute("style", "width: 100%;height: 15px;background-size: 100% 100%;background-image:url(../res/common/sliderProgress.png)");
	// divProcessIcon.setAttribute("style", "width:50px;height:50px;background-size: 100% 100%;position:absolute;right:-30px;top:-15px;background-image:url(../res/common/slider.png)");
	divProcessIcon.setAttribute("class", "rotating")
	div.appendChild(divProcess);
	divProcess.appendChild(divProcessBg);
	divProcess.appendChild(divProcessIcon);
	var container = document.getElementById("process-container")
	if (container) {
		container.appendChild(div);
	}

	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	modProcess.show(function (r) {
		modProcess.value = r * 0.2;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function (r) {
		dirProcess.value = r * 0.8;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});

	var needUpdate = false;

	// alert('next start');
	var loadImages = function (util, fm) {

		var suffixCfg = {
			png: 'down', jpg: 'down', jpeg: 'down', webp: 'down', gif: 'down'
		};

		util.loadDir(["app/res/image/currency/","app/res/image1/"], flags, fm, suffixCfg, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			loadDir1(util, fm);
			
		});
	}

	var loadDir1 = function (util, fm) {
		var sourceList = [
			"pi/ui/",
			"app/components1/",
			"app/res/css/",
			"app/res/js/",
			"app/view/base/",
			"app/view/play/home/",
			"app/view/chat/home/",
			"app/view/wallet/home/",
			"earn/client/app/",
			"earn/xlsx/"

		];

		console.time('firstload');
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
			// console.log(fm);
			console.timeEnd('firstload');
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();

			// 加载根组件
			var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
			root.cfg.full = false; //PC模式
			var index = pi_modules.commonjs.exports.relativeGet("app/view/base/main").exports;
			index.run(function () {
				// 关闭读取界面
				document.body.removeChild(document.getElementById('rcmj_loading_log'));
			});
			// TODO
			registerEarnStruct(util,fm);
			loadDir2(util, fm);
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// TODO 初始化rpc服务
	var registerEarnStruct = function (util,fm) {
		util.loadDir(["earn/client/app/net/", "pi/struct/"], flags, fm, undefined, function (fileMap, mods) {
			pi_modules.commonjs.exports.relativeGet("earn/client/app/net/init").exports.registerRpcStruct(fm);
			pi_modules.commonjs.exports.relativeGet("earn/client/app/net/init").exports.initClient();
		}, function (r) {
			alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
		}, dirProcess.handler);
	};

	var loadDir2 = function (util, fm) {
		console.time('secondLoad');

		var level2SourceList = [
			"app/core/",
			"app/logic/",
			"app/components/",
			"app/res/",
			"app/api/",
			"app/view/"
		];

		// 加载其他文件
		util.loadDir(level2SourceList, flags, fm, undefined, function (fileMap) {
			console.timeEnd('secondLoad');
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();

			var setStore = pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.setStore;
			setStore('flags/level_2_page_loaded', true);
			
			if (updateMod.needForceUpdate()) {
				pi_update.alert({
					btnText:"更新未完成"
				},function(){
					// 注：必须堵住原有的界面操作，不允许任何更新
					updateMod.update(function (e) {
						console.log("update progress: ", e);
						pi_update.updateProgress(e);
					});
				});
			} else {
				updateMod.checkUpdate(function (needUpdate) {
					if (needUpdate) {
						// 注：必须堵住原有的界面操作，不允许任何触发操作
						updateMod.update(function (e) {
							//{type: "saveFile", total: 4, count: 1}
							console.log("update progress: ", e);
							pi_update.updateProgress(e);
						});
					}
				});
			}
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}
	
	// 更新模块
	var updateMod = pi_modules.update.exports;
	updateMod.setIntercept(true);
	updateMod.setServerInfo("app/boot/");
	pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util","pi/util/lang"], {}, function (mods, fm) {
		var html = mods[0],
			util = mods[1],
			lang = mods[2];

		const setting = JSON.parse(localStorage.getItem('setting'));
		lang.setLang(setting && setting.language || 'zh_Hans');  // 初始化语言为简体中文


		// 判断是否第一次进入,决定是显示片头界面还是开始界面
		var userinfo = html.getCookie("userinfo");
		pi_modules.commonjs.exports.flags = html.userAgent(flags);
		flags.userinfo = userinfo;


		//FIXME:直接一次性加载了整个聊天项目，这里需要细化

		//加载聊天框架代码和活动代码
		var loadChatFramework = function () {
			util.loadDir(["pi/lang/", "pi/net/", "pi/ui/", "pi/util/"], flags, fm, undefined, function (fileMap) {
				loadChatApp();
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}

		//加载聊天APP部分代码，实际项目中会分的更细致
		var loadChatApp = function () {
			util.loadDir(["chat/client/app/demo_view/","chat/client/app/widget/","chat/client/app/res/css/","chat/client/app/res/images/"], flags, fm, undefined, function (fileMap) {
				var tab = util.loadCssRes(fileMap);
				// 将预加载的资源缓冲90秒，释放
				tab.timeout = 90000;
				tab.release();
				registerChatStruct();
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}

		//初始化rpc服务
		var registerChatStruct = function () {
			util.loadDir(["chat/client/app/net/", "pi/struct/"], flags, fm, undefined, function (fileMap, mods) {
				// TODO 暂时不初始化聊天的逻辑服
				pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init").exports.registerRpcStruct(fm);
				pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init").exports.initClient();
				loadEmoji();

			}, function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler);
		};

		var loadEmoji = function() {
			util.loadDir(["chat/client/app/res/emoji/"],flags,fm,undefined,function(fileMap,mods){
				//TODO: 可以长期放在缓存中达到更快的显示效果
				loadChatImg();
			},function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler)
		}

		var loadChatImg = function () {
			util.loadDir(["chat/client/app/res/chatImg/"],flags,fm,undefined,function(fileMap,mods){
				//TODO: 可以长期放在缓存中达到更快的显示效果
				//FIXME 临时在此处加载，其实应该先加载这一部分代码
				loadImages(util, fm);
			},function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler)
		}
		/**
		 * 先判断浏览器对webp的支持；
		 * 加载所有的预处理图片
		 * 第一级目录：首页需要的资源；
		 * 第二级目录：其他；
		 * 
		 */
		html.checkWebpFeature(function (r) {
			flags.webp = flags.webp || r;
			//FIXME 临时在此处加载，其实应该先加载loadImages(util, fm);
			// loadActive();
			loadChatFramework()
			// loadImages(util, fm);
		});
	}, function (result) {
		alert("加载基础模块失败, " + result.error + ":" + result.reason);
	}, modProcess.handler);

};

// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps &&
		self.pi_modules &&
		self.pi_modules.butil &&
		self._babelPolyfill &&
		winit.initNext();
	!self._babelPolyfill && setTimeout(winit.init, 100);
})();
