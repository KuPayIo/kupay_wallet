<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"币币兑换","zh_Hant":"幣幣兌換","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}},nextImg:"../../res/image/detailBlueIcon.png"}</app-components-topBar-topBar>
    <div w-class="content">
        {{: tips = [
        {"zh_Hans":"可用","zh_Hant":"可用","en":""},
        {"zh_Hans":"实时汇率","zh_Hant":"實時匯率","en":""},
        {"zh_Hans":"最小发出数量：","zh_Hant":"最小發出數量：","en":""},
        {"zh_Hans":"最大发出数量：","zh_Hant":"最大發出數量：","en":""},
        {"zh_Hans":"手续费不足","zh_Hant":"手續費不足","en":""}] }}


        <div w-class="balance"><pi-ui-lang>{{tips[0]}}</pi-ui-lang>&nbsp;{{it.outBalance}}&nbsp;{{it.outCurrency}}</div>
        <div w-class="coin">
            <img src="{{it.outCurrencyLogo}}" w-class="coinImg"/>
            <span w-class="coinName">{{it.outCurrency}}</span>
        </div>
        {{: inputPlace = [
        {"zh_Hans":"发出数量","zh_Hant":"發出數量","en":""},
        {"zh_Hans":"收到数量","zh_Hant":"收到數量","en":""}] }}

        <div w-class="outInput" ev-input-change="outAmountChange">
            <app-components1-input-input>{placeHolder:{{inputPlace[0]}},style:"padding:20px;",input:{{it.outAmount}},itype:"number"}</app-components1-input-input>
        </div>

        <div w-class="coin" on-tap="inCurrencySelectClick">
            <img src="{{it.inCurrencyLogo}}" w-class="coinImg"/>
            <span w-class="coinName">{{it.inCurrency}}</span>
            <img src="../../../res/image/right_arrow_blue.png" style="width: 40px;height: 40px;"/>
        </div>
        <div w-class="inInput" ev-input-change="inAmountChange">
            <app-components1-input-input>{placeHolder:{{inputPlace[1]}},style:"padding:20px;",input:{{it.receiveAmount}},itype:"number" }</app-components1-input-input>
        </div>

        <div w-class="rate">
            <span style="flex: 1 0 0;"><pi-ui-lang>{{tips[1]}}</pi-ui-lang>&nbsp;<span style="color: #F5A264;">1&nbsp;{{it.outCurrency}}={{it.rate}}&nbsp;{{it.inCurrency}}</span></span>
            <img src="../../../res/image/41_gray.png" w-class="messImg" on-tap="rateDetail"/>
        </div>
        
        <div style="flex: 1 0 0;">
            <div w-class="outMessage"><pi-ui-lang>{{tips[2]}}</pi-ui-lang><span style="color: #888888;">({{it.outCurrency}})&nbsp;{{it.minimum}}</span></div>
            <div w-class="inMessage"><pi-ui-lang>{{tips[3]}}</pi-ui-lang><span style="color: #888888;">({{it.outCurrency}})&nbsp;{{it.maxLimit}}</span></div>
        </div>

        {{if it.outAmount >= it.outBalance}}
        <div style="text-align: center;color: #F5A264;"><pi-ui-lang>{{tips[4]}}</pi-ui-lang></div>
        {{end}}
        <div w-class="sureBtn" ev-btn-tap="sureClick">
            {{: btnName = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}
            <app-components1-btn-btn>{name:{{btnName}},color:"blue"}</app-components1-btn-btn>
        </div>
    
    </div>
</div>