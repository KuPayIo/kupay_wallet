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
    const sourceList = [
        'earn/client/app/view/openBox/',
        'earn/client/app/view/myProduct/',
        'earn/client/app/xls/dataCfg.c.js',
        'earn/client/app/xls/dataCfg.s.js'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载大转盘资源
 */
export const loadTurntableSource = () => {
    const sourceList = [
        'earn/client/app/view/turntable/',
        'earn/client/app/view/myProduct/',
        'earn/client/app/xls/dataCfg.c.js',
        'earn/client/app/xls/dataCfg.s.js',
        'earn/xlsx/awardCfg.c.js',
        'earn/xlsx/awardCfg.s.js'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载我的勋章资源
 */
export const loadMedalSource = () => {
    const sourceList = [
        'earn/client/app/view/medal/',
        'earn/xlsx/errorNum.s.c.js',
        'earn/xlsx/errorNum.s.s.js',
        'earn/xlsx/item.c.js',
        'earn/xlsx/item.s.js'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载挖矿资源
 */
export const loadMiningSource = () => {
    const sourceList = [
        'earn/client/app/view/mining/',
        'earn/client/app/components/mineModalBox/',
        'earn/client/app/xls/mineType.c.js',
        'earn/client/app/xls/mineType.s.js',
        'earn/xlsx/item.c.js',
        'earn/xlsx/item.s.js'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载分享资源
 */
export const loadShareSource = () => {
    const sourceList = [
        'app/components/qrcode/',
        'earn/client/app/view/share/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载嗨豆商城资源
 */
export const loadMallSource = () => {
    const sourceList = [
        'earn/client/app/view/mall/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载关于好嗨相关资源 (公众号 联系我们 关于好嗨 帮助)
 */
export const loadAboutAppSource = () => {
    const sourceList = [
        'app/view/aboutApp/',
        'app/components/basicItem/',
        'app/components/collapse/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载红包资源 
 */
export const loadRedEnvelopeSource = () => {
    const sourceList = [
        'app/view/redEnvelope/',
        'app/components/selectBox/',
        'app/components/basicInput/',
        'app/components1/input/',
        'app/components1/btn/',
        'app/components1/img/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载分红资源 
 */
export const loadDividendSource = () => {
    const sourceList = [
        'app/view/dividend/',
        'app/components/threeParaCard/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载云端充值资源 
 */
export const loadCloudRechargeSource = () => {
    const sourceList = [
        'app/view/cloudRecharge/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载用户信息资源 
 */
export const loadAccountSource = () => {
    const sourceList = [
        'app/view/account/',
        'app/components/basicItem/',
        'app/components1/img/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};

/**
 * 加载设置资源 
 */
export const loadSettingSource = () => {
    const sourceList = [
        'app/view/setting/',
        'app/components/switch/',
        'app/components/basicItem/'
    ];

    return piLoadDir(sourceList,flags,fileMap,suffixCfg);
};