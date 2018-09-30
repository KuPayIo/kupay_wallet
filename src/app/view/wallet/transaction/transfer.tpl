<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head" ev-next-click="doScanClick">
        <app-components1-topBar-topBar>{"title":"{{it.currencyName+ it1.cfgData.topBarTitle}}",background:"#fff"}</app-components1-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="container">
            <div>
                <div w-class="item">
                    <div w-class="inner-tip"><span>{{it.currencyName+ it1.cfgData.tags[0]}}</span><span w-class="balance">{{it1.cfgData.tags[1]}}&nbsp;{{it1.balance}}</span></div>
                    <div w-class="input-father" ev-input-change="amountChange">
                        <app-components-input-input>{itype:"number",placeHolder:{{it1.cfgData.inputPlace}},style:"padding:0;",input:{{it1.amount}},disabled:{{it1.inputDisabled}}}</app-components-input-input>
                        <div w-class="balance-value">≈￥0.00</div>
                    </div>
                </div>
                <div w-class="item" style="padding: 10px 0 0 20px;">
                    <div w-class="inner-tip"><span>{{it1.cfgData.tags[2]}}</span><img src="../../../res/image/scan.png" w-class="scanImg"/></div>
                    <div w-class="input-father1" ev-input-change="toAddrChange">
                        <app-components-input-input>{placeHolder:{{it1.cfgData.inputPlace}},style:"padding:0;",input:{{it1.toAddr}},disabled:{{it1.inputDisabled}}}</app-components-input-input>
                    </div>
                </div>
                <div w-class="item">
                    <div w-class="inner-tip"><span>{{it1.cfgData.tags[3]}}</span></div>
                    <div w-class="from-addr">
                        {{it1.fromAddr}}
                    </div>
                </div>
                <div w-class="item" style="border-bottom: none">
                    <div w-class="inner-tip" on-tap="chooseMinerFee">
                        <span style="flex: 1">{{it1.cfgData.tags[4]}}</span>
                        <span w-class="speed">{{it1.minerFeeList[it1.curLevel].text}}</span>
                        <img src="../../../res/image/right_arrow_blue.png"/>
                    </div>
                    
                </div>
                <div w-class="choose-fee">
                    <span>{{it1.cfgData.tags[5]}}&nbsp;{{it1.minerFee}}</span>
                    <img src="../../../res/image/41_blue.png" on-tap="speedDescClick" w-class="descImg"/>
                </div>
            </div>
            <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        </div>
    </div>
</div>