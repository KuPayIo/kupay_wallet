/**
 * test
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { manualLogin } from '../../viewLogic/localWallet';
// tslint:disable-next-line:max-line-length
import { loadAboutAppSource, loadMallSource, loadMedalSource, loadMiningSource, loadOpenBoxSource, loadRedEnvelopeSource, loadShareSource, loadTurntableSource } from './sourceLoaded';

export class Test extends Widget {
    // 登录
    public login() {
        manualLogin();
    }
    // 开宝箱
    public open1() {
        const loading = popNew('app-components1-loading-loading1');
        loadOpenBoxSource().then(() => {
            popNew('earn-client-app-view-openBox-openBox');
            loading.callback(loading.widget);
        });
    }

     // 大转盘
    public open2() {
        const loading = popNew('app-components1-loading-loading1');
        loadTurntableSource().then(() => {
            popNew('earn-client-app-view-turntable-turntable');
            loading.callback(loading.widget);
        });
    }

    // 我的勋章
    public open3() {
        const loading = popNew('app-components1-loading-loading1');
        loadMedalSource().then(() => {
            popNew('earn-client-app-view-medal-medal');
            loading.callback(loading.widget);
        });
    }

     // 挖矿
    public open4() {
        const loading = popNew('app-components1-loading-loading1');
        loadMiningSource().then(() => {
            popNew('earn-client-app-view-mining-miningHome');
            loading.callback(loading.widget);
        });
    }

     // 分享
    public open5() {
        const loading = popNew('app-components1-loading-loading1');
        loadShareSource().then(() => {
            popNew('earn-client-app-view-share-inviteFriend');
            loading.callback(loading.widget);
        });
    }

    // 嗨豆商城
    public open6() {
        const loading = popNew('app-components1-loading-loading1');
        loadMallSource().then(() => {
            popNew('earn-client-app-view-mall-exchange');
            loading.callback(loading.widget);
        });
    }

    // 公众号 联系我们 关于好嗨 帮助
    public open7(i:number) {
        const loading = popNew('app-components1-loading-loading1');
        loadAboutAppSource().then(() => {
            if (i === 0) {
                popNew('app-view-aboutApp-wechatQrcode',{ fg:1 });
            } else if (i === 1) {
                popNew('app-view-aboutApp-contanctUs');
            } else if (i === 2) {
                popNew('app-view-aboutApp-aboutus');
            } else if (i === 3) {
                popNew('app-view-aboutApp-help');
            }
            
            loading.callback(loading.widget);
        });
    }

     // 发红包 开红包
    public open8(i:number) {
        const loading = popNew('app-components1-loading-loading1');
        loadRedEnvelopeSource().then(() => {
            if (i === 0) {
                popNew('app-view-redEnvelope-writeRedEnv');
            } else {
                popNew('app-view-redEnvelope-exchange');
            }
            
            loading.callback(loading.widget);
        });
    }
}