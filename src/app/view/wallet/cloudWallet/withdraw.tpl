<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":"{{it.currencyName + it1.cfgData.topBarTitle}}",background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
        <div w-class="head2">
            <div w-class="item">
                <img src="../../../res/image/cloud_wallet.png" w-class="icon" />
                <div w-class="text">
                    {{it1.cfgData.cloudWallet}}
                </div>
            </div>
            <div w-class="arow">
                <img src="../../../res/image/left_arrow_white.png" />
            </div>
            <div w-class="item">
                <img src="../../../res/image/local_wallet.png" w-class="icon" />
                <div w-class="text">
                    {{it1.cfgData.localWallet}}
                </div>
            </div>
        </div>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="item1">
                <div w-class="inner-tip"><span>{{it1.cfgData.phrase[0]}}</span><span w-class="balance">{{it1.cfgData.phrase[1]}}&nbsp;{{it1.balance}}</span></div>
                <div w-class="input-father" ev-input-change="amountChange">
                    <app-components1-input-input>{itype:"number",placeHolder:{{it1.cfgData.inputPlace}},style:"padding:0;",input:{{it1.amount}}}</app-components1-input-input>
                </div>
            </div>

            <div w-class="inner-tip" on-tap="chooseWithdrawAddr">
                <span style="padding-left: 30px;">{{it1.cfgData.phrase[2]}}</span>
                <img src="../../../res/image/right_arrow_blue.png" style="border: 20px solid transparent;margin-right: 10px;"/>
            </div>
            <div w-class="input-father1" >
                {{it1.withdrawAddr}}
            </div>

            <div w-class="item2">
                <div w-class="inner-tip" >
                    <div>
                        <span>{{it1.cfgData.phrase[3]}}</span>
                        <span w-class="fee">{{it1.minerFee}}&nbsp;{{it.currencyName}}</span>
                    </div>
                    <img src="../../../res/image/41_blue.png" on-tap="minerFeeDescClick" style="border: 20px solid transparent;"/>
                </div>
            </div>

            <div w-class="bottom-container">
                {{if it1.balance < it1.amount + it1.minerFee}}
                <div w-class="tip">{{it1.cfgData.phrase[4]}}</div>
                {{end}}
                <div ev-btn-tap="withdrawClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
            </div>    
        </div>
    </div>
</div>