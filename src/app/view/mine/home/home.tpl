<div class="new-page" w-class="mine {{it1.close?'mineHide':''}}">
    <div w-class="left {{it1.close?'leftHide':''}}">
        <div w-class="topBack">
            <img src={{it1.avatar}} w-class="userHead" on-tap="login"/>
            <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
            {{if it1.hasWallet}}
            <div w-class="addFriend">
                <img src="../../../res/image/01.png" w-class="scanImg" on-tap="scanQrcode"/>
                <img src="../../../res/image/19.png" w-class="scanImg" on-tap="showMyQrcode"/>
            </div>
            <div w-class="userName">
                {{it1.userName}}
                {{if it1.offline}}
                <widget w-tag="pi-ui-lang" w-class="offline">{zh_Hans:"离线",zh_Hant:"離線",en:"Offline"}</widget>
                {{end}}
            </div>
            
            <div w-class="address" on-tap="copyAddr">
                <span w-class="addrNum">{{it1.address}}</span>
                <img src="../../../res/image1/42.png" w-class="copy"/>
            </div>
            {{else}}
            <div w-class="userName">{{it1.cfgData.defaultName}}</div>            
            {{end}}

        </div>

        <div w-class="leftContent">
            {{for ind,val of it1.list}}
                <div w-class="item" on-tap="itemClick({{ind}})">
                    <img src={{val.img}} w-class="itemImg"/>
                    <span w-class="itemName">{{val.name}}</span>
                    {{if ind==0 && !it1.hasBackupMnemonic && it1.hasWallet}}
                    <div w-class="backup" on-tap="backUp">{{it1.cfgData.backUp}}</div>
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