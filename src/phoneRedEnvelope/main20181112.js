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
        return 'KuPay';
    }
}

const walletName = getWalletName();

// 语言文字
const Config= {
    zh_Hans:{ 
        copySuccess:"复制成功",
        shortMess:walletName+"安全的一站式资产管理平台",
        immeDownload:"立即下载",
        installTutorial:"Android安装教程",
        step1:"点击“立即下载”按钮下载安装文件",
        step2:walletName+"成功安装",
        step3:"进入APP并创建钱包",
        redEnvMess:[
            "恭喜发财 万事如意",
            walletName+"大礼包"
        ],
        redEnvDesc:[
            "您收到一个红包",
            "金额随机，试试手气",
            "您收到一个邀请红包"
        ],
        redEnvLook:"看看大家手气",
        errorList:[
            "红包不存在",
            "红包已领完",
            "红包已过期",
            "红包已领取过",
            "出错啦"
        ],
        copyBtn:"复制红包码",
        receiveBtn:"立即领取红包金额",
        tips:[
            "已领取",
            "共",
            "红包领取规则",
            "1.安装"+walletName+"，创建钱包",
            "2.在钱包里点击发现-发红包",
            "3.输入收到的红包码，红包金额将自动到账",
            "4.同一个红包，每人只能领取一次"
        ]
    },
    zh_Hant:{
        copySuccess:"複製成功",
        shortMess:walletName+"安全的一站式資產管理平台",
        immeDownload:"立即下載",
        installTutorial:"Android安裝教程",
        step1:"點擊“立即下載”按鈕下載安裝文件",
        step2:walletName+"成功安裝",
        step3:"進入APP並創建錢包",
        redEnvMess:[
            "恭喜發財 萬事如意",
            walletName+"大禮包"
        ],
        redEnvDesc:[
            "您收到一個紅包",
            "金額隨機，試試手氣",
            "您收到一個邀請紅包"
        ],
        redEnvLook:"看看大家手氣",
        errorList:[
            "紅包不存在",
            "紅包已領完",
            "紅包已過期",
            "紅包已領取過",
            "出錯啦"
        ],
        copyBtn:"複製紅包碼",
        receiveBtn:"立即領取紅包金額",
        tips:[
            "已領取",
            "共",
            "紅包領取規則",
            "1.安裝"+walletName+"，創建錢包",
            "2.在錢包裡點擊發現-發紅包",
            "3.輸入收到的紅包碼，紅包金額將自動到賬",
            "4.同一個紅包，每人只能領取一次"
        ]
    },
    'en':{

    }
}

// 云端货币类型
const CurrencyType = {
    KT: 100,
    ETH: 101,
    BTC: 102
}
// 枚举云端货币类型
const CloudCurrencyType = {
    100: 'KT',
    101: 'ETH',
    102:'BTC'
};
// 不同红包类型
const RedEnvelopeType = {
    Normal: '00',
    Random: '01',
    Invite: '99'
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
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/mqqbrowser/i)){
        document.getElementsByClassName('tipsPage')[0].setAttribute('style','display:block;');
    }else{
        location.href = "http://app.kuplay.io/KuPlay.apk";
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
function querydetail(uid,rid) {
    var xmlhttp;
	if (window.XMLHttpRequest) {
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else {
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
    
	xmlhttp.open("GET",urlHead+"/red_bag/query_detail_log?rid="+rid+"&uid="+uid,false);
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