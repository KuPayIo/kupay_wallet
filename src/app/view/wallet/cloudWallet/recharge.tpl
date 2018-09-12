<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        <app-components1-topBar-topBar>{"title":"{{it.currencyName}}充值",background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
        <div w-class="head2">
            <div w-class="item">
                <img src="../../../res/image/local_wallet.png" w-class="icon" />
                <div w-class="text">
                    本地钱包
                </div>
            </div>
            <div w-class="arow">
                <img src="../../../res/image/left_arrow_white.png" />
            </div>
            <div w-class="item">
                <img src="../../../res/image/cloud_wallet.png" w-class="icon" />
                <div w-class="text">
                    云账户
                </div>
            </div>
        </div>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="item1">
                <div w-class="inner-tip"><span>充值数量</span><span w-class="balance">余额：&nbsp;{{it1.balance}}</span></div>
                <div w-class="input-father" ev-input-change="amountChange">
                    <app-components-input-input>{itype:"number",placeHolder:"输入金额",style:"padding:0;",input:{{it1.amount}},disabled:{{it1.inputDisabled}}}</app-components-input-input>
                </div>
            </div>
            <div w-class="item1">
                <div w-class="inner-tip" >
                    <div>
                        <span>到账速度</span>
                        <span w-class="speed">{{it1.minerFeeList[it1.curLevel].text}}</span>
                    </div>
                    <img src="../../../res/image/41_blue.png" on-tap="speedDescClick"/>
                </div>
                <div w-class="speed-time">
                    {{it1.minerFeeList[it1.curLevel].time}}
                </div>
            </div>
            <div w-class="choose-fee" on-tap="chooseMinerFee">
                <span>矿工费</span>
                <div w-class="fees"><span w-class="fee">{{it1.minerFee}}</span><img src="../../../res/image/right_arrow_blue.png"/></div>
            </div>
            <div w-class="bottom-container">
                {{if it1.balance < = it1.amount + it1.minerFee}}
                <div w-class="tip">余额不足</div>
                {{end}}
                <div ev-btn-tap="nextClick" w-class="btn"><app-components-btn-btn>{"name":"充值到云端","types":"big","color":"blue"}</app-components-btn-btn></div>
            </div>    
        </div>
    </div>
</div>