<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div>
        {{: topBarTitle = {"zh_Hans":"KT充值","zh_Hant":"KT充值","en":""} }}
        <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>
    </div>
    <div w-class="body">

        {{% 充值金额输入}}
        <div w-class="body-top">
            <widget w-class="top-title" w-tag="pi-ui-lang">{"zh_Hans":"赠送：{{it.giveST}} ST","zh_Hant":"贈送：{{it.giveST}} ST","en":""}</widget>
            <div w-class="pay-list">
                {{for i,item of it.payList}}
                <div on-tap="changePayItem({{i}})" w-class="{{item.KTnum === it.selectPayItem.KTnum?'pay-list-selectItem':'pay-list-item'}} ">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"{{item.KTnum}}KT","zh_Hant":"{{item.KTnum}}KT","en":""}</widget>
                    <widget style="font-size:24px;" w-tag="pi-ui-lang">{"zh_Hans":"售价：{{item.sellPrize}}元","zh_Hant":"售價：{{item.sellPrize}}元","en":""}</widget>
                </div>
                {{end}}
            </div>
            <div w-class="other-input" ev-input-change="inputChange">
                {{: inputPlace = {"zh_Hans":"其它大于20元金额","zh_Hant":"其它大於20元金額","en":""} }}
                <app-components1-input-input>{itype:"integer",maxLength:5,placeHolder:{{inputPlace}},input:{{it.inputValue}},style:"color:#318DE6;background:transparent;"}</app-components1-input-input>
            </div>
        </div>


        {{% 选择支付方式}}
        <div w-class="body-center">
            <div w-class="select-body">


                {{% 微信支付}}
                <div w-class="select-item" on-tap="changPay('wxpay')" style="border-bottom:1px solid #DBDBE5">
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
        </div>


        {{% 支付按钮}}
        <div w-class="body-bottom" ev-btn-tap="rechargeClick">
            {{let btnName = {"zh_Hans":"充值","zh_Hant":"充值","en":""} }}
            <app-components1-btn-btn>{name:{{btnName}},color:"blue",style:"width:90%;"}</app-components1-btn-btn>
        </div>


    </div>
</div>