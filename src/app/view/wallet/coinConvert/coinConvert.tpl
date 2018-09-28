<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    <app-components1-topBar-topBar>{title:{{it1.cfgData.topBarTitle}},nextImg:"../../res/image/detailBlueIcon.png"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="balance">{{it1.cfgData.tips[0]}}&nbsp;{{it1.outBalance}}&nbsp;{{it1.outCurrency}}</div>
        <div w-class="coin">
            <img src="../../../res/image/currency/{{it1.outCurrency}}.png" w-class="coinImg"/>
            <span w-class="coinName">{{it1.outCurrency}}</span>
        </div>
        <div w-class="outInput" ev-input-change="outAmountChange">
            <app-components1-input-input>{placeHolder:{{it1.cfgData.inputPlace[0]}},style:"padding:20px;",input:{{it1.outAmount}},itype:"number"}</app-components1-input-input>
        </div>

        <div w-class="coin" on-tap="inCurrencySelectClick">
            <img src="../../../res/image/currency/{{it1.inCurrency}}.png" w-class="coinImg"/>
            <span w-class="coinName">{{it1.inCurrency}}</span>
            <img src="../../../res/image/right_arrow_blue.png" style="width: 40px;height: 40px;"/>
        </div>
        <div w-class="inInput" ev-input-change="inAmountChange">
            <app-components1-input-input>{placeHolder:{{it1.cfgData.inputPlace[1]}},style:"padding:20px;",input:{{it1.receiveAmount}},itype:"number" }</app-components1-input-input>
        </div>

        <div w-class="rate">
            <span style="flex: 1 0 0;">{{it1.cfgData.tips[1]}}&nbsp;<span style="color: #F5A264;">1&nbsp;{{it1.outCurrency}}={{it1.rate}}&nbsp;{{it1.inCurrency}}</span></span>
            <img src="../../../res/image/41_blue.png" w-class="messImg" on-tap="rateDetail"/>
        </div>
        
        <div style="flex: 1 0 0;">
            <div w-class="outMessage">{{it1.cfgData.tips[2]}}<span style="color: #888888;">({{it1.outCurrency}})&nbsp;{{it1.minimum}}</span></div>
            <div w-class="inMessage">{{it1.cfgData.tips[3]}}<span style="color: #888888;">({{it1.outCurrency}})&nbsp;{{it1.maxLimit}}</span></div>
        </div>

        {{if it1.outAmount >= it1.outBalance}}
        <div style="text-align: center;color: #F5A264;">{{it1.cfgData.tips[4]}}</div>
        {{end}}
        <div w-class="sureBtn" ev-btn-tap="sureClick">
            <app-components1-btn-btn>{name:{{it1.cfgData.btnName}},color:"blue"}</app-components1-btn-btn>
        </div>
    
    </div>
</div>