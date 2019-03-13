<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
            {{: topBarTitle = {"zh_Hans":it.currencyName+"转账","zh_Hant":it.currencyName+"轉賬","en":""} }}
            <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="container">
            <div>
                {{: tags = [
                    {"zh_Hans":"转账","zh_Hant":"轉賬","en":""},
                    {"zh_Hans":"余额：","zh_Hant":"餘額：","en":""},
                    {"zh_Hans":"收款地址","zh_Hant":"收款地址","en":""},
                    {"zh_Hans":"付款地址","zh_Hant":"付款地址","en":""},
                    {"zh_Hans":"到账速度","zh_Hant":"到賬速度","en":""},
                    {"zh_Hans":"矿工费","zh_Hant":"礦工費","en":""}] }}


                {{: inputPlace = [
                    {"zh_Hans":"输入金额","zh_Hant":"輸入金額","en":""},
                    {"zh_Hans":"填入地址","zh_Hant":"填入地址","en":""}] }}
                <div w-class="item">
                    <div w-class="inner-tip">
                        <span>{{it.currencyName}} <pi-ui-lang>{{tags[0]}}</pi-ui-lang></span> 
                        <span w-class="balance"><pi-ui-lang>{{tags[1]}}</pi-ui-lang>&nbsp;{{it.balance%1===0?it.balance.toFixed(2):it.balance}}</span>
                    </div>
                    <div w-class="input-father" ev-input-change="amountChange">
                        <div w-class="balance-value">≈{{it.currencyUnitSymbol+" "+it.amountShow}}</div>
                        {{: inputPlace0 = {"zh_Hans":"输入金额","zh_Hant":"輸入金額","en":""} }}
                        <widget w-tag="app-components1-input-input">{itype:"number",placeHolder:{{inputPlace0}},style:"padding:0;font-size:36px;background:transparent;",input:{{it.amount}},disabled:{{it.inputDisabled}} }</widget>
                    </div>
                </div>
                <div w-class="item" style="padding: 10px 0 0 20px;">
                    <div w-class="inner-tip"><pi-ui-lang>{{tags[2]}}</pi-ui-lang><img src="../../../res/image/scan.png" w-class="scanImg" on-tap="doScanClick"/></div>
                    <div w-class="input-father1" ev-input-change="toAddrChange">
                        <app-components1-input-input>{placeHolder:{{inputPlace[1]}},style:"padding:0;font-size:28px;",input:{{it.toAddr}},disabled:{{it.inputDisabled}}}</app-components1-input-input>
                    </div>
                </div>
                <div w-class="item">
                    <div w-class="inner-tip"><pi-ui-lang>{{tags[3]}}</pi-ui-lang></div>
                    <div w-class="from-addr">
                        {{it.fromAddr}}
                    </div>
                </div>
                <div w-class="item" style="border-bottom: none">
                    <div w-class="inner-tip" on-tap="chooseMinerFee">
                        <span style="flex: 1"><pi-ui-lang>{{tags[4]}}</pi-ui-lang></span>
                        <span w-class="speed">
                            {{if typeof(it.minerFeeList[it.curLevel].text) ==='string'}}
                                {{it.minerFeeList[it.curLevel].text}}
                            {{else}}
                                <pi-ui-lang>{{it.minerFeeList[it.curLevel].text}}</pi-ui-lang>
                            {{end}}
                        </span>
                        <img src="app/res/image/down_arrow_gray.png" width="32px"/>
                    </div>
                    
                </div>
                <div w-class="choose-fee">
                    <span on-tap="speedDescClick"><pi-ui-lang>{{tags[5]}}</pi-ui-lang>&nbsp;{{it.minerFee}}</span>
                    <img src="../../../res/image/41_gray.png" on-tap="speedDescClick" w-class="descImg"/>
                </div>
            </div>
            {{: btnName = {"zh_Hans":"下一步","zh_Hant":"下一步","en":""} }}
            <div ev-btn-tap="nextClick" w-class="btn"><app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn></div>
        </div>
    </div>
</div>