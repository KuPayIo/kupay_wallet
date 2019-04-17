<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div>
    {{: topBarTitle = {"zh_Hans":"充值","zh_Hant":"充值","en":""} }}
    <widget w-tag="app-components-topBar-topBar">{"title":{{topBarTitle}} }</widget>
    
    <div w-class="body">
        {{% 充值金额输入}}
        <div w-class="body-top">
            {{: let title1 = {"zh_Hans":"银两余额","zh_Hant":"銀兩餘額","en":""} }}
            <div w-class="top-title1"><widget w-tag="pi-ui-lang">{{title1}}</widget><span w-class="balance">{{it.scBalance}}</span></div>
            {{: let title2 = {"zh_Hans":"快捷充值","zh_Hant":"快捷充值","en":""} }}
            <div w-class="top-title2"><widget w-tag="pi-ui-lang">{{title2}}</widget></div>
            <div w-class="pay-list">
                {{for i,item of it.payList}}
                <div on-tap="changePayItem({{i}})" w-class="{{i === it.selectPayItemIndex ? 'pay-list-selectItem':'pay-list-item'}} ">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"{{item.sellNum}}{{it.scShow}}","zh_Hant":"{{item.sellNum}}{{it.scShow}}","en":""}</widget>
                    <widget style="font-size:24px;" w-tag="pi-ui-lang">{"zh_Hans":"售价：{{item.sellPrize}}元","zh_Hant":"售價：{{item.sellPrize}}元","en":""}</widget>
                </div>
                {{end}}
            </div>
            <div w-class="other-input" ev-input-change="inputChange">
                {{: inputPlace = {"zh_Hans":"自定义充值金额","zh_Hant":"自定義充值金額","en":""} }}
                <app-components1-input-input>{itype:"number",maxLength:4,placeHolder:{{inputPlace}},input:{{it.SCNum}},style:"color:rgba(34,34,34,1);;background:transparent;"}</app-components1-input-input>
                {{: let scNumTip = {"zh_Hans":it.SCNum + it.scShow,"zh_Hant":it.SCNum + it.scShow,"en":""} }}
                <div w-class="input-suffix"><widget w-tag="pi-ui-lang">{{scNumTip}}</widget></div>
            </div>
            {{: let giftTip1 = {"zh_Hans":"充"+it.scShow+"，送10倍" + it.ktShow,"zh_Hant":"充"+it.scShow+"，送10倍" + it.ktShow,"en":""} }}
            {{: let giftTip2 = {"zh_Hans":"送" + it.giveKT + it.ktShow,"zh_Hant":"送" + it.giveKT + it.ktShow,"en":""} }}
            {{: let giftTip = it.giveKT ? giftTip2 : giftTip1}}
            <div w-class="gift"><widget w-tag="pi-ui-lang">{{giftTip}}</widget></div>
        </div>

        <div style="height:10px;background-color:rgba(242,242,242,1);width:100%;"></div>
        {{% 选择支付方式}}
        <div w-class="body-center">
            {{: let payTitle = {"zh_Hans":"支付方式","zh_Hant":"支付方式","en":""} }}
            <div w-class="pay-title"><widget w-tag="pi-ui-lang">{{payTitle}}</widget></div>
            <div w-class="select-body">
                {{% 微信支付}}
                <div w-class="select-item" on-tap="changPay('wxpay')">
                    <div w-class="select-detail">
                        <img src="app/res/image/wxPay.png" width="60px" />
                        <widget w-class="pay-name" w-tag="pi-ui-lang">{"zh_Hans":"微信支付","zh_Hant":"微信支付","en":""}</widget>
                    </div>
                    <div w-class="select-round">
                        {{if it.payType ==='wxpay'}}
                        <img src="app/res/image/icon_right2.png" width="42px" />
                        {{else}}
                        <div w-class="select-img"></div>
                        {{end}}
                    </div>
                </div>


                {{% 支付宝支付}}
                <div w-class="select-item" on-tap="changPay('alipay')">
                    <div w-class="select-detail">
                        <img src="app/res/image/aliPay.png" width="60px" />
                        <widget w-class="pay-name" w-tag="pi-ui-lang">{"zh_Hans":"支付宝支付","zh_Hant":"支付寶支付","en":""}</widget>
                    </div>
                    <div w-class="select-round">
                        {{if it.payType ==='alipay'}}
                        <img src="app/res/image/icon_right2.png" width="42px" />
                        {{else}}
                        <div w-class="select-img"></div>
                        {{end}}
                    </div>
                </div>
            </div>
            {{% 支付按钮}}
            <div w-class="body-bottom" ev-btn-tap="rechargeClick">
                {{let btnName = {"zh_Hans":"支付","zh_Hant":"支付","en":""} }}
                <app-components1-btn-btn>{name:{{btnName}},color:"blue",style:"width:90%;"}</app-components1-btn-btn>
            </div>
        </div>
        
    </div>
</div>
</div>