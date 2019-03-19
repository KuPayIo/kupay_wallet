<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
        <div w-class="top-head">
            {{: topBarTitle = {"zh_Hans":it.stShow + "充值","zh_Hant":it.stShow + "充值","en":""} }}
            <widget w-tag="app-components-topBar-topBar">{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6);position: fixed;"}</widget>
    
        </div>
        <div w-class="body">


            {{% 充值金额输入}}
            <div w-class="body-top">
                <div w-class="inner-tip">
                    <span style="position:relative">
                        <img src="app/res/image/currency/GT.png" width="32px" w-class="input-icon"/>
                        <widget w-tag="pi-ui-lang" style="padding-left:40px">{"zh_Hans":"充值金额","zh_Hant":"充值金額","en":""}</widget>
                    </span>
                    <span w-class="balance">
                        <pi-ui-lang>{"zh_Hans":"余额：","zh_Hant":"餘額：","en":""}</pi-ui-lang>&nbsp;
                        {{it.balance%1===0?it.balance.toFixed(2):it.balance}} 
                    </span>
                </div>
                <div w-class="input-father" ev-input-change="amountChange">
                    {{: inputPlace = {"zh_Hans":"￥输入金额","zh_Hant":"￥輸入金額","en":""} }}
                    <div w-class="balance-value">≈{{it.num}}&nbsp;{{it.stShow}}</div>
                    <app-components-input-input>{itype:"moneyNum1",maxLength:7,placeHolder:{{inputPlace}},input:{{it.total}},style:"padding:0;background:transparent;"}</app-components-input-input>
                </div>
            </div>


            {{% 选择支付方式}}
            <div w-class="body-center">
                <widget w-class="select-title" w-tag="pi-ui-lang">{"zh_Hans":"选择支付方式","zh_Hant":"選擇支付方式","en":""}</widget>
                <div w-class="select-body">


                    {{% 微信支付}}
                    <div w-class="select-item" on-tap="changPay('wxpay')" style="border-bottom:1px solid #DBDBE5">
                        <div w-class="select-detail">
                            <img src="app/res/image/wxPay.png" width="60px"/>
                            <widget w-class="pay-name" w-tag="pi-ui-lang">{"zh_Hans":"微信支付","zh_Hant":"微信支付","en":""}</widget>
                        </div>
                        <div w-class="select-round">
                            {{if it.payType ==='wxpay'}}
                                <img src="app/res/image/icon_right2.png" width="42px"/>
                            {{else}}
                                <div w-class="select-img"></div>
                            {{end}}
                        </div>
                    </div>


                    {{% 支付宝支付}}
                    <div w-class="select-item" on-tap="changPay('alipay')">
                        <div w-class="select-detail">
                            <img src="app/res/image/aliPay.png" width="60px"/>
                            <widget w-class="pay-name" w-tag="pi-ui-lang">{"zh_Hans":"支付宝支付","zh_Hant":"支付寶支付","en":""}</widget>
                        </div>
                        <div w-class="select-round">
                            {{if it.payType ==='alipay'}}
                                <img src="app/res/image/icon_right2.png" width="42px"/>
                            {{else}}
                                <div w-class="select-img"></div>
                            {{end}}
                        </div>
                    </div>

                </div>
            </div>

            
            {{% 支付按钮}}
            <div w-class="body-bottom" ev-btn-tap="rechargeClick">
                <widget w-class="btn-tip" w-tag="pi-ui-lang">{"zh_Hans":"充值金额不小于0.01元","zh_Hant":"充值金額不小於0.01元","en":""}</widget>
                {{let btnName = {"zh_Hans":"充值到云端","zh_Hant":"充值到雲端","en":""} }}
                <app-components1-btn-btn>{name:{{btnName}},color:"blue",style:"width:90%;"}</app-components1-btn-btn>
            </div>
        </div>
    </div>