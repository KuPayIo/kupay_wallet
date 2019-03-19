<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        {{: topBarTitle = {"zh_Hans":it.currencyName+"提币","zh_Hant":it.currencyName+"提幣","en":""} }}
        <app-components-topBar-topBar>{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components-topBar-topBar>
        <div w-class="head2">
            <div w-class="item">
                <img src="../../../res/image/cloud_wallet.png" w-class="icon" />
                <div w-class="text">
                    <pi-ui-lang>{"zh_Hans":"云账户","zh_Hant":"雲賬戶","en":""}</pi-ui-lang>
                </div>
            </div>
            <div w-class="arow">
                <img src="../../../res/image/left_arrow_white.png" />
            </div>
            <div w-class="item">
                <img src="../../../res/image/local_wallet.png" w-class="icon" />
                <div w-class="text">
                    <pi-ui-lang>{"zh_Hans":"本地钱包","zh_Hant":"本地錢包","en":""}</pi-ui-lang>
                </div>
            </div>
        </div>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="item1">
                {{: phrase = [
                    {"zh_Hans":"提币数量","zh_Hant":"提幣數量","en":""},
                    {"zh_Hans":"余额：","zh_Hant":"餘額：","en":""},
                    {"zh_Hans":"地址","zh_Hant":"地址","en":""},
                    {"zh_Hans":"本次提笔手续费","zh_Hant":"本次提幣手續費","en":""},
                    {"zh_Hans":"余额不足","zh_Hant":"餘額不足","en":""}] }}
                <div w-class="inner-tip"><pi-ui-lang>{{phrase[0]}}</pi-ui-lang><span w-class="balance"><pi-ui-lang>{{phrase[1]}}</pi-ui-lang>&nbsp;{{it.balance%1===0?it.balance.toFixed(2):it.balance}}</span></div>
                <div w-class="input-father" ev-input-change="amountChange">
                    {{: inputPlace = {"zh_Hans":"输入金额","zh_Hant":"輸入金額","en":""} }}
                    <app-components1-input-input>{itype:"number",placeHolder:{{inputPlace}},style:"padding:0;",input:{{it.amount}}}</app-components1-input-input>
                </div>
            </div>

            <div w-class="inner-tip" on-tap="chooseWithdrawAddr">
                <span style="padding-left: 30px;"><pi-ui-lang>{{phrase[2]}}</pi-ui-lang></span>
                <img src="../../../res/image/right_arrow_blue.png" style="border: 20px solid transparent;margin-right: 10px;"/>
            </div>
            <div w-class="input-father1" >
                {{it.withdrawAddr}}
            </div>

            <div w-class="item2">
                <div w-class="inner-tip" >
                    <div>
                        <pi-ui-lang>{{phrase[3]}}</pi-ui-lang>
                        <span w-class="fee">{{it.minerFee}}&nbsp;{{it.currencyName}}</span>
                    </div>
                    <img src="../../../res/image/41_gray.png" on-tap="minerFeeDescClick" style="border: 20px solid transparent;width: 32px;"/>
                </div>
            </div>

            <div w-class="bottom-container">
                {{if it.balance < it.amount + it.minerFee}}
                <div w-class="tip"><pi-ui-lang>{{phrase[4]}}</pi-ui-lang></div>
                {{end}}
                <div ev-btn-tap="withdrawClick" w-class="btn">
                    {{: btnName = {"zh_Hans":"提币","zh_Hant":"提幣","en":""} }}    
                    <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
                </div>
            </div>    
        </div>
    </div>
</div>