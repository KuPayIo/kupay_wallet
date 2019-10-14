/**
 * 调用底层的方法
 */
import { AdPlatform, ADUnion, PlayEvent } from "../../pi/browser/ad_unoin";

/**
 * 预先下载广告
 */
export const preLoadAd = (adType?: AdPlatform,cb?:(str1:string,str2:string) => void) => {
    adType = adType ? adType : Math.random() > 0.5 ? AdPlatform.GDT : AdPlatform.CSJ;
    ADUnion.loadRewardVideoAD(adType,(str1,str2) => {
        cb && cb(str1,str2);
    });
};
/**
 * 观看广告
 * adtype:1.广点通  2.字节跳动
 */
// tslint:disable-next-line:no-reserved-keywords
export const watchAd = (adType: AdPlatform,cb?:(isSuccess: number, event: PlayEvent, info: string) => void) => {
    // tslint:disable-next-line:no-reserved-keywords
    ADUnion.showRewardVideoAD(adType,(isSuccess,event,info) => {
        cb && cb(isSuccess,event,info);
        preLoadAd();
    });
};

/**
 * 选择播放的广告类型
 */
export const chooseAdType = (cb:Function) => {
    const ads = [];
    ADUnion.getADNumber((gdtAdNumber,csjAdNumber) => {
        for (let i = 0;i < gdtAdNumber;i ++) {
            ads.push(AdPlatform.GDT);
        }
        for (let i = 0;i < csjAdNumber;i ++) {
            ads.push(AdPlatform.CSJ);
        }
        const len = ads.length;
        const index = Math.floor(Math.random() * 100) % len;
        const adType = ads[index] || (Math.random() > 0.5 ? AdPlatform.GDT : AdPlatform.CSJ);
        cb && cb(adType);
    });
};