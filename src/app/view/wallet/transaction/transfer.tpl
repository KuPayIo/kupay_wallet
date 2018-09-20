<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head" ev-next-click="doScanClick">
        <app-components1-topBar-topBar>{"title":"{{it.currencyName}}转账",background:"#fff",nextImg:"../../res/image/scan.png"}</app-components1-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="container">
            <div>
                <div w-class="item">
                    <div w-class="inner-tip"><span>{{it.currencyName}}转账</span><span w-class="balance">余额：&nbsp;{{it1.balance}}</span></div>
                    <div w-class="input-father" ev-input-change="amountChange">
                        <app-components-input-input>{itype:"number",placeHolder:"输入金额",style:"padding:0;",input:{{it1.amount}},disabled:{{it1.inputDisabled}}}</app-components-input-input>
                        <div w-class="balance-value">≈￥0.00</div>
                    </div>
                </div>
                <div w-class="item">
                    <div w-class="inner-tip"><span>收款地址</span><img src="../../../res/image/contact.png"/></div>
                    <div w-class="input-father1" ev-input-change="toAddrChange">
                        <app-components-input-input>{placeHolder:"填入地址",style:"padding:0;",input:{{it1.toAddr}},disabled:{{it1.inputDisabled}}}</app-components-input-input>
                    </div>
                </div>
                <div w-class="item">
                    <div w-class="inner-tip"><span>付款地址</span></div>
                    <div w-class="from-addr">
                        {{it1.fromAddr}}
                    </div>
                </div>
                <div w-class="item">
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
            </div>
            <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":"下一步","types":"big","color":"blue"}</app-components1-btn-btn></div>
        </div>
    </div>
</div>