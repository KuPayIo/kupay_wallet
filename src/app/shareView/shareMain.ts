/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { open, setUrl } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { Forelet } from '../../pi/widget/forelet';
import { addWidget } from '../../pi/widget/util';
import { getLocalStorage } from '../utils/tools';
import { RedEnvelopeType } from './store/conMgr';

// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = async (cb): Promise<any> => {
    addWidget(document.body, 'pi-ui-root');
    await openSocket();
    popNewPage();
    // eth代币精度初始化
    if (cb) cb();
    // test();
};

const openSocket = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        setUrl(`ws://127.0.0.1:2081`);
        open(() => {
            resolve();
        }, () => {
            reject();
        });
    });

};

const popNewPage = () => {
    const takeRedBag = getLocalStorage('takeRedBag');
    if (!takeRedBag) {
        popNew('app-shareView-redEnvelope-openRedEnvelope');
        
        return;
    }
    const itype = parseUrlParams(window.location.search, 'type');
    // 普通红包
    if (itype !== RedEnvelopeType.Invite) {
        const rid = parseUrlParams(window.location.search, 'rid');
        if (takeRedBag.rid === rid) {
            popNew('app-shareView-redEnvelope-redEnvelopeDetails', { ...takeRedBag });
        } else {
            popNew('app-shareView-redEnvelope-openRedEnvelope');
        }
    } else {
        const cid = parseUrlParams(window.location.search, 'cid');
        if (takeRedBag.cid === cid) {
            popNew('app-shareView-redEnvelope-redEnvelopeDetails', { ...takeRedBag });
        } else {
            popNew('app-shareView-redEnvelope-openRedEnvelope');
        }
    }
    
};

const parseUrlParams = (search: string, key: string) => {
    const ret = search.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};