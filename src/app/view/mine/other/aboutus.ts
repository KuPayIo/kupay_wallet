/**
 * about us
 */
// =======================================导入
import { rippleShow } from '../../../../chat/client/app/logic/logic';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getLocalVersion, popNewMessage } from '../../../utils/tools';
// =========================================导出
declare var pi_modules;
declare var pi_update;
export class Aboutus extends Widget {
    public ok: () => void;
    public language: any;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            version: getLocalVersion(),
            data: [
                { value: this.language.itemTitle[0], components: 'app-view-mine-other-privacypolicy' },
                { value: this.language.itemTitle[1], components: '' },
                { value: this.language.itemTitle[2], components: '' }
            ],
            walletLogo:getModulConfig('WALLET_LOGO'),
            walletName:getModulConfig('WALLET_NAME')
        };
    }

    public itemClick(e: any, index: number) {
        if (index === 0 && this.props.data[index].components !== '') {
            popNew(this.props.data[index].components);
        } else if (index === 1) { // 版本更新
            h5CheckUpdate();
        } else {
            // TODO 分享下载
            // popNew('app-components-share-share', { 
            //     shareType: ShareToPlatforms.TYPE_LINK,
            //     url: shareDownload,
            //     title:`${this.props.walletName}钱包`,
            //     content:`我正在使用${this.props.walletName}，邀您一起来使用！` 
            // });
            // console.error(shareDownload);
            popNew('app-view-mine-other-shareDownload');
        }
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    
    public backPrePage() {
        this.ok && this.ok();
    }
}

const h5CheckUpdate = () => {
    const h5UpdateMod = pi_modules.update.exports;
    const appUpdateMod = pi_modules.appUpdate.exports;
    // needUpdateCode 0 1 2 3 
    h5UpdateMod.checkUpdate((needUpdateCode) => {
        // 判断当前app版本是否大于等于依赖的版本号
        const appLocalVersion = appUpdateMod.getAppLocalVersion();
        let canUpdate = false;
        if (appLocalVersion) {  
            const dependAppVersionArr = h5UpdateMod.getDependAppVersion().split('.');
            const appLocalVersionArr = appUpdateMod.getAppLocalVersion().split('.');
            for (let i = 0;i < dependAppVersionArr.length;i++) {
                if (i === dependAppVersionArr.length - 1) {
                    canUpdate = appLocalVersionArr[i] >= dependAppVersionArr[i];
                    break;
                }
                if (appLocalVersionArr[i] < dependAppVersionArr[i]) {
                    canUpdate = false;
                    break;
                } else if (appLocalVersionArr[i] > dependAppVersionArr[i]) {
                    canUpdate = true;
                    break;
                }
            }
        } else {  // 还没获取到本地版本号  不更新
            canUpdate = false;
        }

        const remoteVersion = h5UpdateMod.getRemoteVersion();
        const option:any = {
            updated:h5UpdateMod.getH5Updated(),
            version:remoteVersion.slice(0,remoteVersion.length - 1).join('.')
        };

        // 更新h5
        const updateH5 = () => {
            // 注：必须堵住原有的界面操作，不允许任何触发操作
            h5UpdateMod.update((e) => {
                // {type: "saveFile", total: 4, count: 1}
                console.log('update progress: ', e);
                pi_update.updateProgress(e);
            });
        };
        // debugger;
        if (needUpdateCode === 1 && canUpdate) {
            option.alertBtnText = '更新未完成';
            pi_update.alert(option,updateH5);
        } else if (needUpdateCode === 2 && canUpdate) {
            option.alertBtnText = '版本有重大变化';
            pi_update.alert(option,updateH5);
        } else if (needUpdateCode === 3 && canUpdate) {
            pi_update.confirm(option,(ok) => {
                if (ok) {
                    updateH5();
                }
            });
        } else {
            popNewMessage('已是最新版本');
        }
    });
};
