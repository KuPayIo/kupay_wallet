<div w-class="account" on-tap="pageClicked" id="account" class="ga-new-page" ev-back-click="backClick">
    <app-components-topBar-topBar>{title:"云账户"}</app-components-topBar-topBar>
    <div w-class="accountInfo">
        <img src="../../../res/image/{{it1.accoutHeadImg}}" w-class="headImg" />
        <input id="nicknameInput" on-input="nickNameChanged" type="text" value="{{it1.accoutNickName}}" w-class="accountNameInput"/>
    </div>
    <div w-class="balanceDetail">
        <div w-class="overView">
            账户资产
            <span w-class="balance">
                {{it1.accountAssets}}
            </span>
        </div>

        {{for i,v of it1.coinList}}
        <div w-class="item" on-tap="itemClicked(e,'{{v.coinType}}')">
                <img src="../../../res/image/currency/{{v.coinType}}.png" w-class="coinIcon" />
                <span w-class="coinType">{{v.coinType}}</span>
                <span w-class="coinBalance">{{v.coinBalance}}</span>
                <img src="../../../res/image/cloud_arow_right.png" w-class="arow" />
        </div>
        {{end}}
    </div>
</div>