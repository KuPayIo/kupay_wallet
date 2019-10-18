import { getStore, setStore } from '../../store/memstore';
import { piLoadDir } from '../../utils/commonjsTools';

/**
 * 资源加载
 */

let flags;    //  loadDir flags
let fileMap;     // loadDir fileMap
let suffixCfg;    // loadDir suffixCfg

// 初始化资源加载
export const init = (fl:any,fm:any,sc:any) => {
    flags = fl;
    fileMap = fm;
    suffixCfg = sc;
};

/**
 * 加载开宝箱资源
 */
export const loadOpenBoxSource = () => {
    const fg = getStore('flags').loadOpenBoxSource;
    const sourceList = [
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/components1/loading/',
        'earn/client/app/view/openBox/',
        'earn/client/app/components/lotteryModal/',
        'earn/client/app/view/myProduct/',
        'earn/client/app/xls/dataCfg.c.js',
        'earn/client/app/xls/dataCfg.s.js',
        'app/net/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {
        setStore('flags/loadOpenBoxSource',true);
    });
};

/**
 * 加载大转盘资源
 */
export const loadTurntableSource = () => {
    const fg = getStore('flags').loadTurntableSource;
    const sourceList = [
        'app/components1/blankDiv/',
        'earn/client/app/components/lotteryModal/',
        'app/components/topBar/',
        'app/components1/loading/',
        'earn/client/app/view/turntable/',
        'earn/client/app/view/myProduct/',
        'earn/client/app/xls/dataCfg.c.js',
        'earn/client/app/xls/dataCfg.s.js',
        'earn/xlsx/awardCfg.c.js',
        'earn/xlsx/awardCfg.s.js',
        'app/net/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {
        setStore('flags/loadOpenBoxSource',true);
    });
};

/**
 * 加载我的勋章资源
 */
export const loadMedalSource = () => {
    const fg = getStore('flags').loadMedalSource;
    const sourceList = [
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'earn/client/app/view/medal/',
        'earn/server/rpc/',
        'earn/client/app/net/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {
        setStore('flags/loadMedalSource',true); 
    });
};

/**
 * 加载挖矿资源
 */
export const loadMiningSource = () => {
    const fg = getStore('flags').loadMiningSource;
    const sourceList = [
        'earn/client/app/view/mining/',
        'earn/client/app/components/mineModalBox/',
        'app/components1/blankDiv/',
        'app/components1/loading/',
        'earn/client/app/xls/mineType.c.js',
        'earn/client/app/xls/mineType.s.js',
        'earn/xlsx/item.c.js',
        'earn/xlsx/item.s.js',
        'earn/xlsx/awardCfg.c.js',
        'earn/xlsx/awardCfg.s.js',
        'app/net/',
        'earn/client/app/net/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {
        setStore('flags/loadMiningSource',true);
    });
};

/**
 * 加载分享资源
 */
export const loadShareSource = () => {
    const fg = getStore('flags').loadShareSource;
    const sourceList = [
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/components/qrcode/',
        'earn/client/app/view/share/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => { 
        setStore('flags/loadShareSource',true);  
    });
};

/**
 * 加载嗨豆商城资源
 */
export const loadMallSource = () => {
    const fg = getStore('flags').loadMallSource;
    const sourceList = [
        'earn/client/app/view/mall/',
        'app/components1/blankDiv/',
        'app/components/topBar/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {    
        setStore('flags/loadMallSource',true);   
    });
};

/**
 * 加载关于好嗨相关资源 (公众号 联系我们 关于好嗨 帮助)
 */
export const loadAboutAppSource = () => {
    const fg = getStore('flags').loadAboutAppSource;
    const sourceList = [
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/view/aboutApp/',
        'app/components/basicItem/',
        'app/components/collapse/',
        'earn/client/app/view/share/inviteFriend/',
        'app/components/share/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {     
        setStore('flags/loadAboutAppSource',true);
    });
};

/**
 * 加载红包资源 
 */
export const loadRedEnvelopeSource = () => {
    const fg = getStore('flags').loadRedEnvelopeSource;
    const sourceList = [
        'app/view/redEnvelope/',
        'app/components/selectBox/',
        'app/components/basicInput/',
        'app/components1/input/',
        'app/components1/btn/',
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/components1/img/',
        'app/components1/loading/',
        'earn/client/app/components/noviceTaskAward/',
        'earn/client/app/xls/',
        'app/net/',
        'app/components/share/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {   
        setStore('flags/loadRedEnvelopeSource',true);   
    });
};

/**
 * 加载分红资源 
 */
export const loadDividendSource = () => {
    const fg = getStore('flags').loadDividendSource;
    const sourceList = [
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/view/dividend/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {   
        setStore('flags/loadDividendSource',true);  
    });
};

/**
 * 加载用户信息资源 
 */
export const loadAccountSource = () => {
    const fg = getStore('flags').loadAccountSource;
    const sourceList = [
        'app/view/account/',
        'app/components1/checkSex/',
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/components/basicItem/',
        'app/components1/img/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {     
        setStore('flags/loadAccountSource',true);  
    });
};

/**
 * 加载设置资源 
 */
export const loadSettingSource = () => {
    const fg = getStore('flags').loadSettingSource;
    const sourceList = [
        'app/view/setting/',
        'app/components1/blankDiv/',
        'app/components/topBar/',
        'app/components/switch/',
        'app/components/basicItem/',
        'app/components1/input/',
        'app/components/bindPhone/',
        'app/components/modalBox/',
        'app/components1/loading/',
        'chat/client/app/widget/pageEdit/',
        'chat/client/app/widget/topBar/',
        'chat/client/app/widget/input/',
        'earn/xlsx/',
        'earn/client/app/components/noviceTaskAward/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => { 
        setStore('flags/loadSettingSource',true);  
    });
};

/**
 * 加载嗨嗨号资源
 */
export const loadHaihaiSource = () => {
    const fg = getStore('flags').loadHaihaiSource;
    const sourceList = [
        'chat/client/app/view/info/',
        'chat/client/app/widget/topBar/',
        'app/components1/blankDiv/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg,fg).then(() => {    
        setStore('flags/loadHaihaiSource',true); 
    });
};
