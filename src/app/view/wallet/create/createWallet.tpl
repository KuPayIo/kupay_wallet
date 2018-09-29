<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        <app-view-wallet-components-tipsCard>{{it1.cfgData.tipsCard}}</app-view-wallet-components-tipsCard>
        
        <div w-class="bottom-box">
            <div w-class="avatar-container" on-tap="selectImageClick">
                {{if !it1.chooseImage}}
                <div style="background-image: url(../../../res/image/default_avater_big.png);" w-class="avatar"></div>
                {{else}}
                <widget w-tag="pi-ui-html" w-class="ui-html">{{it1.avatarHtml}}</widget>
                {{end}}
                {{if !it1.chooseImage}}
                <div w-class="choose-img-mask">
                    <img src="../../../res/image/choose_img.png" w-class="choose-img"/>
                </div>
                {{end}}
            </div>
            <div w-class="name-box" ev-input-change="walletNameChange">
                <app-components1-input-input>{input:{{it1.walletName}},maxLength:10}</app-components1-input-input>
                <img w-class="random" src="../../../res/image/dice.png" on-tap="randomPlayName"/>
            </div>
            <div ev-psw-change="pswChange"><app-components-password-password>{hideTips:true}</app-components-password-password></div>
            <div w-class="input-father" ev-input-change="pswConfirmChange"><app-components-input-suffixInput>{itype:"password",placeHolder:{{it1.cfgData.inputPlace}},clearable:true,available:{{it1.pswEqualed}}}</app-components-input-suffixInput></div>
            <div w-class="registered-protocol" ev-checkbox-click="checkBoxClick">
                <app-components1-checkbox-checkbox>{itype:"false",text:{{it1.cfgData.readAgree}} }</app-components1-checkbox-checkbox>
                <span w-class="user-protocol" on-tap="agreementClick">{{it1.cfgData.agreement}}</span>
            </div>
            <div ev-btn-tap="createClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"white"}</app-components1-btn-btn></div>
        </div>
    </div>
</div>