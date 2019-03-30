<div class="new-page" w-class="mine {{it.close?'mineHide':''}}">
    <div w-class="left {{it.close?'leftHide':''}}">
        <div w-class="topBack">
            <widget w-tag="app-components1-img-img" w-class="userHead" on-tap="login">{imgURL:{{it.avatar}},width:"120px;"}</widget>
            <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
            {{if it.hasWallet}}
            <div w-class="addFriend">
                <div w-class="scanImg1" on-tap="showMyMedal">
                    <img src="{{it.medalest}}" w-class="scanImg2"/>
                </div>
                <img src="../../../res/image/01.png" w-class="scanImg" on-tap="scanQrcode"/>
                <img src="../../../res/image/19.png" w-class="scanImg" on-tap="showMyQrcode"/>
            </div>
            <div w-class="userName" on-tap="tex">
                {{it.userName}}

                {{if it.userLevel === 5}}
                    <div w-class="official">官方</div>
                {{end}}
            </div>
            
            <div w-class="address" on-tap="copyAddr">
                <span w-class="addrNum">好嗨号：{{it.acc_id}}</span>
                <img src="../../../res/image/copy_write.png" width="40px" w-class="copy"/>
            </div>
            {{else}}
            <div w-class="userName">
                <pi-ui-lang>{"zh_Hans":"点击头像登录","zh_Hant":"點擊頭像登錄","en":""}</pi-ui-lang>
            </div>            
            {{end}}

        </div>

        <div w-class="leftContent">
            {{: itemName = 
            [{"zh_Hans":"账户","zh_Hant":"賬戶","en":""},
            {"zh_Hans":"帮助","zh_Hant":"幫助","en":""},
            {"zh_Hans":"设置","zh_Hant":"設置","en":""},
            {"zh_Hans":"联系我们","zh_Hant":"聯繫我們","en":""},
            {"zh_Hans":"关于" +it.walletName,"zh_Hant":"關於" +it.walletName,"en":""}] }}


            {{for ind,val of it.list}}
                <div w-class="item" on-tap="itemClick({{ind}})" on-down="onShow">
                    <img src={{val.img}} w-class="itemImg"/>
                    <span w-class="itemName">
                        <pi-ui-lang>{{itemName[ind]}}</pi-ui-lang>
                    </span>
                    {{if ind==0 && !it.isTourist && !it.hasBackupMnemonic && it.hasWallet}}
                    <div w-class="backup" on-tap="backUp">
                        <pi-ui-lang>{"zh_Hans":"备份","zh_Hant":"備份","en":""}</pi-ui-lang>
                    </div>
                    {{end}}
                </div>
                {{if ind == 2}}
                    <div w-class="line"></div>
                {{end}}
            {{end}}
        </div>  
    </div>
    <div w-class="right" on-tap="closePage"></div>         
</div>