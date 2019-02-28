/**
 * 什么是助记词
 */
import { Widget } from '../../../../pi/widget/widget';

export  class MnemonicDesc extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        const mnemonicDesc = [
            { 
                zh_Hans:'助记词是有十几个英文单词组成的一段字符串，是私钥的另一种表现形式，和私钥一样需要保持机密，他人获取后即可获取你的全部资产。',
                zh_Hant:'助記詞是有十幾個英文單詞組成的一段字符串，是私鑰的另一種表現形式，和私鑰一樣需要保持機密，他人獲取後即可獲取你的全部資產。',
                en:'' 
            },{ 
                zh_Hans:'创建钱包时需要保存好自己的助记词，屏幕截图或保存在互联网设备中都不安全，最好的方式使用纸笔抄录下来保存在安全的地方。',
                zh_Hant:'創建錢包時需要保存好自己的助記詞，屏幕截圖或保存在互聯網設備中都不安全，最好的方式使用紙筆抄錄下來保存在安全的地方。',
                en:'' 
            },{ 
                zh_Hans:'助记词可以用来恢复钱包数据，当更换设备或删除账号后，可以通过助记词恢复数据。',
                zh_Hant:'助記詞可以用來恢復錢包數據，當更換設備或刪除賬號後，可以通過助記詞恢復數據。',
                en:'' 
            },{ 
                zh_Hans:'hd钱包的助记词是通用的，一个钱包对应一个助记词，可以用于生成多种货币的地址。',
                zh_Hant:'hd錢包的助記詞是通用的，一個錢包對應一個助記詞，可以用於生成多種貨幣的地址。',
                en:'' 
            }
        ];
        this.props = {
            mnemonicDesc
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}