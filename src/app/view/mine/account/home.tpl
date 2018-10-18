<div class="new-page" ev-back-click="backPrePage" on-tap="pageClick">
    <app-components1-topBar-topBar>{title:{{it1.cfgData.topBarTitle}},background:"#fff"}</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="head-container">
            <img w-class="avatar" src="{{it1.avatar ? it1.avatar : '../../../res/image/default_avater_big.png'}}" on-tap="uploadAvatar"/>
            {{if it1.userInput}}
                <input id="walletNameInput" w-class="edit-input" value="{{it1.nickName}}" on-blur="walletNameInputBlur" on-focus="walletNameInputFocus" maxlength="10" autofocus="autofocus" placeholder="{{it1.cfgData.defaultName}}"/>
            {{else}}
                <span w-class="edit-input">{{it1.nickName}}</span>
            {{end}}
            <img src="../../../res/image/edit_blue.png" w-class="edit" on-tap="changeInput"/>
            
        </div>
        <div w-class="other">
            <div on-tap="changePhone">
                {{if it1.phone.indexOf('*') > 0}}
                <div w-class="other-item" ev-switch-click="onSwitchChange">
                    <span w-class="item-title">{{it1.cfgData.itemTitle[0]}}</span>
                    <span w-class="tag">{{it1.phone}}</span>
                </div>
                {{else}}
                <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[0]}},describe:{{it1.phone}}}</app-components-basicItem-basicItem>
                {{end}}
            </div>
            <div on-tap="changePsw">
                <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[1]}},style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
            </div>
        </div>
        <div w-class="other">
            <div w-class="other-item" on-tap="backupWalletClick">
                <div w-class="item-title">{{it1.cfgData.itemTitle[2]}}</div>
                {{if !it1.backup}}
                <div w-class="tag">{{it1.cfgData.itemTitle[3]}}</div>
                {{end}}
                <img src="../../../res/image/right_arrow_blue.png" w-class="rightArrow"/>
            </div>
            <div w-class="other-item" on-tap="exportPrivateKeyClick">
                <div w-class="item-title">{{it1.cfgData.itemTitle[4]}}</div>
                <img src="../../../res/image/right_arrow_blue.png" w-class="rightArrow"/>
            </div>
        </div>
    </div>
</div>