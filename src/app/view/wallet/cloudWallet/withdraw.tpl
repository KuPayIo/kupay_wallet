<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":"{{it.currencyName}}提币",background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
        <div w-class="head2">
            <div w-class="item">
                <img src="../../../res/image/cloud_wallet.png" w-class="icon" />
                <div w-class="text">
                    云账户
                </div>
            </div>
            <div w-class="arow">
                <img src="../../../res/image/left_arrow_white.png" />
            </div>
            <div w-class="item">
                <img src="../../../res/image/local_wallet.png" w-class="icon" />
                <div w-class="text">
                    本地钱包
                </div>
            </div>
        </div>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="item1">
                <div w-class="inner-tip"><span>提币数量</span><span w-class="balance">余额：&nbsp;{{it1.balance}}</span></div>
                <div w-class="input-father" ev-input-change="amountChange">
                    <app-components-input-input>{itype:"number",placeHolder:"输入金额",style:"padding:0;",input:{{it1.amount}}}</app-components-input-input>
                </div>
            </div>
            <div w-class="item1">
                <div w-class="inner-tip"><span>地址</span><img src="../../../res/image/right_arrow_blue.png" on-tap="chooseWithdrawAddr"/></div>
                <div w-class="input-father1" >
                    {{it1.withdrawAddr}}
                </div>
            </div>
            <div w-class="item2">
                <div w-class="inner-tip" >
                    <div>
                        <span>本次提币手续费</span>
                        <span w-class="fee">{{it1.minerFee}}&nbsp;{{it.currencyName}}</span>
                    </div>
                    <img src="../../../res/image/41_blue.png" on-tap="minerFeeDescClick"/>
                </div>
            </div>
            <div w-class="bottom-container">
                {{if it1.balance < = it1.amount}}
                <div w-class="tip">余额不足</div>
                {{end}}
                <div ev-btn-tap="withdrawClick" w-class="btn"><app-components-btn-btn>{"name":"提币","types":"big","color":"blue"}</app-components-btn-btn></div>
            </div>    
        </div>
    </div>
</div>