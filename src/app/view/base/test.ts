/**
 * test
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { piLoadDir } from '../../utils/commonjsTools';

export class Test extends Widget {
    // 开宝箱
    public open1() {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'earn/client/app/view/openBox/',
            'earn/client/app/view/myProduct/',
            'earn/xlsx/',
            'earn/client/app/xls/'
        ];
        piLoadDir(sourceList).then(() => {
            popNew('earn-client-app-view-openBox-openBox');
            loading.callback(loading.widget);
        });
    }

     // 大转盘
    public open2() {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'earn/client/app/view/turntable/',
            'earn/client/app/view/myProduct/',
            'earn/xlsx/',
            'earn/client/app/xls/'
        ];
        piLoadDir(sourceList).then(() => {
            popNew('earn-client-app-view-turntable-turntable');
            loading.callback(loading.widget);
        });
    }

    // 我的勋章
    public open3() {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'earn/client/app/view/medal/',
            'earn/xlsx/',
            'earn/client/app/xls/'
        ];
        piLoadDir(sourceList).then(() => {
            popNew('earn-client-app-view-medal-medal');
            loading.callback(loading.widget);
        });
    }

     // 挖矿
    public open4() {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'earn/client/app/view/mining/',
            'earn/xlsx/',
            'earn/client/app/xls/'
        ];
        piLoadDir(sourceList).then(() => {
            popNew('earn-client-app-view-mining-miningHome');
            loading.callback(loading.widget);
        });
    }

     // 分享
    public open5() {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'app/components/qrcode/',
            'earn/client/app/view/share/',
            'earn/xlsx/',
            'earn/client/app/xls/'
        ];
        piLoadDir(sourceList).then(() => {
            popNew('earn-client-app-view-share-inviteFriend');
            loading.callback(loading.widget);
        });
    }

    // 嗨豆商城
    public open6() {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'earn/client/app/view/mall/',
            'earn/xlsx/',
            'earn/client/app/xls/'
        ];
        piLoadDir(sourceList).then(() => {
            popNew('earn-client-app-view-mall-exchange');
            loading.callback(loading.widget);
        });
    }

    // 公众号 联系我们 关于好嗨 帮助
    public open7(i:number) {
        const loading = popNew('app-components1-loading-loading1');
        const sourceList = [
            'app/view/aboutApp/',
            'app/components/basicItem/',
            'app/components/collapse/'
        ];
        piLoadDir(sourceList).then(() => {
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
        const sourceList = [
            'app/view/redEnvelope/',
            'app/components/selectBox/',
            'app/components/basicInput/',
            'app/components1/input/',
            'app/components1/btn/',
            'app/components1/img/'
        ];
        piLoadDir(sourceList).then(() => {
            if (i === 0) {
                popNew('app-view-redEnvelope-writeRedEnv');
            } else {
                popNew('app-view-redEnvelope-exchange');
            }
            
            loading.callback(loading.widget);
        });
    }
}