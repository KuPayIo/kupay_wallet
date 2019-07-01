<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
        {{: topBarTitle = {"zh_Hans":"充值","zh_Hant":"充值","en":""} }}
        <div><widget w-tag="app-components-topBar-topBar">{"title":{{topBarTitle}} }</widget></div>
        <div w-class="body">
            {{% 订单详情}}
            <div w-class="body-top">
                <div w-class="box1">
                    <div w-class="order-item"><widget w-tag="pi-ui-lang">{"zh_Hans":"订单号","zh_Hant":"訂單號","en":""}</widget><span>{{it.order.transaction_id}}</span></div>
                    <div w-class="order-item"><widget w-tag="pi-ui-lang">{"zh_Hans":{{ it.walletName + "ID" }},"zh_Hant":{{ it.walletName + "ID" }},"en":""}</widget><span>{{it.acc_id}}</span></div>
                    <div w-class="order-item"><widget w-tag="pi-ui-lang">{"zh_Hans":{{ it.scShow + "余额" }},"zh_Hant":{{ it.scShow + "餘額" }},"en":""}</widget><span>{{it.scBalance}}</span></div>
                </div>
                <div w-class="box2">
                    <div w-class="order-item"><widget w-tag="pi-ui-lang">{"zh_Hans":"收款方","zh_Hant":"收款方","en":""}</widget><span>{{ it.beneficiary }}</span></div>
                    <div w-class="order-item"><widget w-tag="pi-ui-lang">{"zh_Hans":"收款价格","zh_Hant":"收款價格","en":""}</widget><span>{{it.total_fee_show}}{{it.scShow}}</span></div>
                    <div w-class="order-item" style="color:rgba(245,162,100,1);"><widget w-tag="pi-ui-lang">{"zh_Hans":"还需支付","zh_Hant":"還需支付","en":""}</widget><div><span>{{it.needPay}}</span>元</div></div>
                </div>
            </div>
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