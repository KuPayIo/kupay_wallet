/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { login, setUrl } from '../../pi/net/ui/con_mgr';
import { open, popNew } from '../../pi/ui/root';
import { Forelet } from '../../pi/widget/forelet';
import { addWidget } from '../../pi/widget/util';
import { getLocalStorage, setLocalStorage } from '../utils/tools'
import { Addr } from './interface';
import { isString } from '../../pi/util/util';
// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export const run = (cb): void => {
	addWidget(document.body, 'pi-ui-root');
	//数据检查
	checkUpdate()
	//打开界面
	popNew('app-view-app');
	//popNew('app-view-test-test');
	//popNew('app-view-wallet-walletCreate-walletCreate');	// popNew('app-view-application-home');
	// popNew('app-view-groupwallet-groupwallet');
	//popNew('app-view-financialManagement-home');
	//popNew('app-view-mine-changePassword-changePassword1');

	if (cb) cb();
};


const checkUpdate = () => {
	const wallets = getLocalStorage("wallets");
	if (wallets) {
		let list: Addr[] = getLocalStorage("addrs") || [];
		let isUpdate = false;
		//将缓存中的地址信息数据结构进行调整
		wallets.walletList.map(v => {
			v.currencyRecords.map(v1 => {
				v1.addrs = v1.addrs.map(v2 => {
					if (isString(v2)) return v2;
					if (!isHad(list, v2.addr)) {
						list.push({ addr: v2.addr, balance: 0, currencyName: v1.currencyName, addrName: v2.addrName, gwlt: v2.gwlt, record: v2.record });
						isUpdate = true;
					}

					return v2.addr;
				})
				return v1;
			});
			return v;
		});
		if (isUpdate) {
			setLocalStorage("addrs", list, false)
			setLocalStorage("wallets", wallets, false)
		}
	}
}


const isHad = (list, elAddr) => {
	return list.some(v => v.addr === elAddr);
}

// ============================== 立即执行
