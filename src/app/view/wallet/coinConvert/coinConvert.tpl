<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"币币兑换","zh_Hant":"幣幣兌換","en":""} }}
    <app-components1-topBar-topBar>{title:{{topBarTitle}},nextImg:"../../res/image/detailBlueIcon.png"}</app-components1-topBar-topBar>
    <div w-class="content">
        {{: tips = [
        {"zh_Hans":"可用","zh_Hant":"可用","en":""},
        {"zh_Hans":"实时汇率","zh_Hant":"實時匯率","en":""},
        {"zh_Hans":"最小发出数量：","zh_Hant":"最小發出數量：","en":""},
        {"zh_Hans":"最大发出数量：","zh_Hant":"最大發出數量：","en":""},
        {"zh_Hans":"手续费不足","zh_Hant":"手續費不足","en":""}] }}


        <div w-class="balance"><pi-ui-lang>{{tips[0]}}</pi-ui-lang>&nbsp;{{it1.outBalance}}&nbsp;{{it1.outCurrency}}</div>
        <div w-class="coin">
            <img src="../../../res/image/currency/{{it1.outCurrency}}.png" w-class="coinImg"/>
            <span w-class="coinName">{{it1.outCurrency}}</span>
        </div>
        {{: inputPlace = [
        {"zh_Hans":"发出数量","zh_Hant":"發出數量","en":""},
        {"zh_Hans":"收到数量","zh_Hant":"收到數量","en":""}] }}

        <div w-class="outInput" ev-input-change="outAmountChange">
            <app-components1-input-input>{placeHolder:{{inputPlace[0]}},style:"padding:20px;",input:{{it1.outAmount}},itype:"number"}</app-components1-input-input>
        </div>

        <div w-class="coin" on-tap="inCurrencySelectClick">
            <img src="../../../res/image/currency/{{it1.inCurrency}}.png" w-class="coinImg"/>
            <span w-class="coinName">{{it1.inCurrency}}</span>
            <img src="../../../res/image/right_arrow_blue.png" style="width: 40px;height: 40px;"/>
        </div>
        <div w-class="inInput" ev-input-change="inAmountChange">
            <app-components1-input-input>{placeHolder:{{inputPlace[1]}},style:"padding:20px;",input:{{it1.receiveAmount}},itype:"number" }</app-components1-input-input>
        </div>

        <div w-class="rate">
            <span style="flex: 1 0 0;"><pi-ui-lang>{{tips[1]}}</pi-ui-lang>&nbsp;<span style="color: #F5A264;">1&nbsp;{{it1.outCurrency}}={{it1.rate}}&nbsp;{{it1.inCurrency}}</span></span>
            <img src="../../../res/image/41_gray.png" w-class="messImg" on-tap="rateDetail"/>
        </div>
        
        <div style="flex: 1 0 0;">
            <div w-class="outMessage"><pi-ui-lang>{{tips[2]}}</pi-ui-lang><span style="color: #888888;">({{it1.outCurrency}})&nbsp;{{it1.minimum}}</span></div>
            <div w-class="inMessage"><pi-ui-lang>{{tips[3]}}</pi-ui-lang><span style="color: #888888;">({{it1.outCurrency}})&nbsp;{{it1.maxLimit}}</span></div>
        </div>

        {{if it1.outAmount >= it1.outBalance}}
        <div style="text-align: center;color: #F5A264;"><pi-ui-lang>{{tips[4]}}</pi-ui-lang></div>
        {{end}}
        <div w-class="sureBtn" ev-btn-tap="sureClick">
            {{: btnName = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}
            <app-components1-btn-btn>{name:{{btnName}},color:"blue"}</app-components1-btn-btn>
        </div>
    
    </div>
</div>