// ==========================================静态变量,静态方法

const serverIp = window.location.origin;
const urlHead = serverIp+":8099";

// 上传的文件url前缀
const uploadFileUrlPrefix = serverIp+`/service/get_file?sid=`;

// 解析url参数
const parseUrlParams = (search, key) => {
    const ret = search.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};

// 获取当前语言设置
const getLanguage = () => {
    const search = window.location.search;
    let lan = parseUrlParams(search,'lan');
    if(!lan && !localStorage.language){
        localStorage.language = 'zh_Hans'
        return Config.zh_Hans;
    }
    if(lan){
        localStorage.language = lan;
    }else{
        lan = localStorage.language;
    }
    return Config[lan];
}
// 获取钱包名字
const getWalletName = () =>{
    const search = window.location.search;
    let walletName = parseUrlParams(search,'walletName');
    if(walletName){        
        return walletName;
    }else{
        return '好嗨';
    }
}

const walletName = getWalletName();

// 语言文字
const Config= {
    zh_Hans:{ 
        copySuccess:"复制成功",
        shortMess:"好玩又赚钱",
        immeDownload:"立即下载",
        step1:"下载app即可在“赚”中兑换红包或使用邀请码",
        redEnvMess:[
            "恭喜发财 万事如意",
            walletName+"大礼包"
        ],
        redEnvDesc:[
            "您收到一个红包",
            "金额随机，试试手气",
            "您收到一个邀请码"
        ],
        redEnvLook:"看看大家手气",
        errorList:[
            "红包不存在",
            "红包已领完",
            "红包已过期",
            "红包已领取过",
            "出错啦"
        ],
        copyBtn:"复制",
        receiveBtn:"立即领取",
        tips:[
            "已领取",
            "共",
            "奖券兑换",
            "1、24小时未兑换的奖券将退回 ",
            "2、在钱包里点击赚钱-兑换",
            "3、输入收到的奖券码，奖券将自动到账",
            "4、奖券可以用来抽奖、兑换、合成、送好友"
        ]
    },
    zh_Hant:{
        copySuccess:"複製成功",
        shortMess:"好玩又賺錢",
        immeDownload:"立即下載",
        step1:"下載app即可在“賺”中兌換紅包或使用邀請碼",
        redEnvMess:[
            "恭喜發財 萬事如意",
            walletName+"大禮包"
        ],
        redEnvDesc:[
            "您收到一個紅包",
            "金額隨機，試試手氣",
            "您收到一個邀請碼"
        ],
        redEnvLook:"看看大家手氣",
        errorList:[
            "紅包不存在",
            "紅包已領完",
            "紅包已過期",
            "紅包已領取過",
            "出錯啦"
        ],
        copyBtn:"複製",
        receiveBtn:"立即領取",
        tips:[
            "已領取",
            "共",
            "獎券兌換",
            "1、24小時未兌換的獎券將退回",
            "2、在錢包裡點擊賺錢 - 兌換",
            "3、輸入收到的獎券碼，獎券將自動到賬",
            "4、獎券可以用來抽獎，兌換，合成，送好友"
        ]
    },
    'en':{

    }
}

// 云端货币类型
const CurrencyType = {
    KT: 100,
    ETH: 101,
    BTC: 102,
    ST: 103
}
// 枚举云端货币类型
const CloudCurrencyType = {
    100: 'KT',
    101: 'ETH',
    102:'BTC',
    103:'ST'
};
// 不同红包类型
const RedEnvelopeType = {
    Normal: '00',
    Random: '01',
    Invite: '99',
    Ticket: '02'
}
// 复制到剪切板
const copyToClipboard = (copyText) => {
    
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if(navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
    popMessage(getLanguage().copySuccess);
};
// 弹出提示框
const popMessage = (str) => {
    const element = document.createElement('div');
    element.setAttribute("class","messageMain");
    element.innerHTML = str;
    document.body.appendChild(element);
    setTimeout(() => {
        element.setAttribute("style","animation: popUpMess 0.3s forwards");
    }, 100);
    setTimeout(() => {
        element.setAttribute("style","animation: removeMess 0.3s forwards");
        setTimeout(() => {
            document.body.removeChild(element);
        }, 300);
    }, 2000);
}

// 根据货币类型小单位转大单位 
const smallUnit2LargeUnitString = (currencyName,amount) => {
    if (currencyName === 'ETH') {

        return formatBalance(wei2Eth(amount));
    } else if (currencyName === 'BTC') {

        return formatBalance(sat2Btc(amount));
    } else {

        return formatBalance(kpt2kt(amount));
    }
};
// unicode数组转字符串
const unicodeArray2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length;i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

/**
 * 金额格式化
 * @param banlance 金额
 */
const formatBalance = (banlance) => {
    return Number(banlance.toFixed(6));
};

/**
 * kpt转kt
 */
const kpt2kt = (num) => {
    num = Number(num);

    return num / Math.pow(10, 9);
};

/**
 * wei转eth
 */
const wei2Eth = (amount) => {
    const decimals = BigNumber('1000000000000000000');
    const wei = new BigNumber(amount);
    
    const balance = wei.div(decimals);

    return formatBalance(Number(balance.toString(10)));
};

/**
 * sat转btc
 */
const sat2Btc = (num) => {
    num = Number(num);

    return num / Math.pow(10, 8);
};

// 时间戳格式化 毫秒为单位
const timestampFormat = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// =============================方法定义

/**
 * 下载APP
 */
function downloadClick() {
    var ua = navigator.userAgent;
    var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;   //判断是否是 android终端
    var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);     //判断是否是 ios终端
    var isIosQQ = (isIOS && / QQ/i.test(ua));    // ios内置qq浏览器
    var isAndroidQQ = (isAndroid && /MQQBrowser/i.test(ua) && /QQ/i.test(ua.split('MQQBrowser'))); // android内置qq浏览器
    var isWX = ua.match(/MicroMessenger/i) == "MicroMessenger";   // 微信
    // alert(`isIosQQ = ${isIosQQ},isAndroidQQ = ${isAndroidQQ},isWX = ${isWX}`);
    if(isWX || isIosQQ || isAndroidQQ){
        document.getElementsByClassName('tipsPage')[0].setAttribute('style','display:block;');
    }else{
        location.href = "https://app.herominer.net/wallet/appversion/xzxd_1.0.6.apk";
    }
}
/**
 * 关闭覆盖层
 */
function closeTips(){
    document.getElementsByClassName('tipsPage')[0].setAttribute('style','display:none;');
}
/**
 * 立即领取红包金额
 */
function receiveClick(){
    window.location.href = './download.html';
}
/**
 * 普通红包开红包
 */
function takeRedEnvelope(rid){
    var xmlhttp;
	if (window.XMLHttpRequest) {
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else {
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
    
	xmlhttp.open("GET",urlHead+"/red_bag/take_red_bag?rid="+rid,false);
    xmlhttp.send();
    
    return xmlhttp.responseText;
}
/**
 * 查询红包领取详情
 */
function querydetail(accId,rid) {
    var xmlhttp;
	if (window.XMLHttpRequest) {
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else {
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
    
	xmlhttp.open("GET",urlHead+"/red_bag/query_detail_log?rid="+rid+"&acc_id="+accId,false);
    xmlhttp.send();

    return JSON.parse(xmlhttp.responseText);
}
/**
 * 批量查询用户的基础信息
 */
function userDetails(uids){
    var xmlhttp;
	if (window.XMLHttpRequest) {
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else {
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
    
	xmlhttp.open("GET",urlHead+"/user/get_infos?list="+`[${uids.toString()}]`,false);
    xmlhttp.send();

    return JSON.parse(xmlhttp.responseText);
}

if(winit) winit();